# Plan: TanStack Query sobre `tecnicos`

## Objetivo

Implementar TanStack Query como capa intermedia entre las pantallas de React Native y los repositories, usando la tabla `tecnicos` como plantilla modelo. El repository sigue siendo la única capa que habla con SQLite.

## Arquitectura

```
React Native (screens)  →  useQuery / useMutation
                                    │
                              TanStack Query  →  cache, dedupe, invalidation
                                    │
                              Repositories  →  tecnicoRepository.create/get/update/delete
                                    │
                              SQLite local (expo-sqlite)
```

## Estado actual (punto de partida)

- `expo-sqlite` con singleton lazy en `src/db/client.ts`.
- `tecnicoRepository` (`src/repositories/tecnico.repository.ts`) ya tiene CRUD async completo:
  - `create(input: CreateTecnicoInput): Promise<TecnicoType>`
  - `getById(id): Promise<TecnicoType | null>`
  - `getByUserId(userId): Promise<TecnicoType | null>`
  - `update(id, input): Promise<TecnicoType>`
  - `delete(id): Promise<void>`
- Screens usan fetching manual con `useState` + `useFocusEffect`:
  - `components/perfil/Tecnico.tsx` (listado por userId + eliminar)
  - `app/(perfil)/tecnico/editar.tsx` (getById + update)
  - `app/(perfil)/tecnico/nuevo.tsx` (create)
- `@tanstack/react-query` **NO está instalado** (solo `@tanstack/react-form`).

## Decisiones de diseño

1. **El repository no cambia** — sigue devolviendo promesas, sin imports de Query.
2. **Query es una capa fina** — `queryFn`/`mutationFn` solo delegan al repository.
3. **`@tanstack/react-form` sigue vivo** para el form state local (valores de inputs); Query maneja el data state (persistencia).
4. **Invalidation ancha** para esta tabla chica: invalidar `tecnicoKeys.all` tras cada mutación.
5. **`refetchOnWindowFocus: false`** (móvil); el refetch al volver se resuelve con invalidación tras mutación.
6. **`staleTime: 5 min`** — datos locales que solo cambian vía mutaciones propias.

## Pasos de implementación

### 1. Instalar dependencia

```
pnpm add @tanstack/react-query
```

### 2. QueryClient + proveedor

Crear `src/query/query-client.ts`:

```ts
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
})
```

Envolver en `app/_layout.tsx` con el provider (una sola instancia, una sola vez):

```tsx
<QueryClientProvider client={queryClient}>
  <Stack ... />
</QueryClientProvider>
```

> Nota: el root usa `<Stack>`, no `<Slot>` (expo-router usa `Slot` internamente). No crear `queryClient` dentro de cada componente.

### 3. Key factory

Crear `src/query/keys/tecnico.keys.ts`:

```ts
export const tecnicoKeys = {
  all: ["tecnicos"] as const,
  byUserId: (userId: string) => [...tecnicoKeys.all, "byUserId", userId] as const,
  byId: (id: string) => [...tecnicoKeys.all, "byId", id] as const,
}
```

### 4. Queries

Crear `src/query/hooks/use-tecnico.ts`:

```ts
import { useQuery } from "@tanstack/react-query"
import { tecnicoRepository } from "@/src/repositories/tecnico.repository"
import { tecnicoKeys } from "../keys/tecnico.keys"

export function useTecnicoByUserId(userId: string) {
  return useQuery({
    queryKey: tecnicoKeys.byUserId(userId),
    queryFn: () => tecnicoRepository.getByUserId(userId),
    enabled: !!userId,
  })
}

export function useTecnicoById(id: string | undefined) {
  return useQuery({
    queryKey: tecnicoKeys.byId(id ?? ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Tecnico ID requerido")
      }

      return tecnicoRepository.getById(id)
    },
    enabled: Boolean(id),
  })
}
```

### 5. Mutations

```ts
export function useCreateTecnico() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTecnicoInput) => tecnicoRepository.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: tecnicoKeys.all }),
  })
}

export function useUpdateTecnico() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateTecnicoInput> }) =>
      tecnicoRepository.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: tecnicoKeys.all }),
  })
}

export function useDeleteTecnico() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tecnicoRepository.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tecnicoKeys.all }),
  })
}
```

> Para garantizar el orden `mutation → SQLite confirma → invalidate → navegación`, usar `mutateAsync` en el componente. `onSuccess` **retorna** la promesa de `invalidateQueries`, así `mutateAsync` recién resuelve cuando la invalidación terminó.

### 6. Migrar las screens

**`components/perfil/Tecnico.tsx`**
- Reemplazar `useState` + `useFocusEffect` por `useTecnicoByUserId(USER_ID)`.
- `isLoading` sustituye `tecnico === undefined`.
- `data ?? null` sustituye el estado `null`.
- Eliminar `load`/`onDeleted`; el delete usa `useDeleteTecnico().mutateAsync(tecnico.id)` y la invalidación refresca solo.

**`app/(perfil)/tecnico/nuevo.tsx`**
- Sustituir `tecnicoRepository.create(...)` en `onSubmit` por `useCreateTecnico().mutateAsync(...)`.
- `isPending` reemplaza `isSubmitting`; `error` viene de `mutation.error`.

**`app/(perfil)/tecnico/editar.tsx`**
- Reemplazar `useFocusEffect`/`useState` por `useTecnicoById(tecnicoId)`.
- Sustituir `tecnicoRepository.update(...)` por `useUpdateTecnico().mutateAsync(...)`.

## Nota: `useFocusEffect` desaparece del fetching

`useFocusEffect` ya no se usa para cargar datos. El refetch-on-focus que antes daba lo cubren:
- **Invalidation** tras cada mutación (guarda → listado refetch).
- **`refetchOnMount`** (default) refetch si la data está `stale` (>5 min).

Flujos cubiertos:

```
Listado → Editar → guardar → Volver → Listado   (mutación invalida → refetch)
Listado → Editar → cancelar → Volver → Listado  (sin mutación → caché intacta)
```

Si algún día se necesita refetch explícito al enfocar, usar `useFocusEffect` + `query.refetch()` (no necesario para este caso).

## Revisión de decisiones (conclusiones)

| Punto | Decisión |
|-------|----------|
| Refetch al enfocar | `refetchOnWindowFocus: false`; invalidar tras mutación |
| staleTime | 5 min (datos locales) |
| Invalidation | `tecnicoKeys.all` (tabla chica) |
| React Form | se mantiene para form state |

## Validación

- Crear técnico → aparece en listado sin recargar manual.
- Editar técnico → listado actualizado al volver.
- Eliminar técnico → listado se refresca solo.
- Verificar que `@tanstack/react-form` sigue funcionando en los formularios.

## Próximos pasos (replicar a otras tablas)

Una vez validado `tecnicos`, replicar el mismo patrón (keys + hooks + migración de screens) a:
- `empresas`
- `instrumentos`
- `informes-iluminacion`
- `areas-iluminacion`
- `localizadas-iluminacion`
