# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Firewall rule for Expo Go access

If Expo Go cannot connect from a mobile device on the same local network, create this firewall rule in **Command Prompt (Admin)**:

```
netsh advfirewall firewall add rule name="Expo Dev" dir=in action=allow protocol=TCP localport=19000,19001,19002,8081,19006 profile=any
```

If the rule already exists, delete it first:

```
netsh advfirewall firewall delete rule name="Expo Dev"
```

# PhoneMockup Image Slider Implementation

## Component Location
`app/(tabs)/index.tsx` - `PhoneMockup()` function

## Implementation Details

### Timer Management with `useFocusEffect`
```typescript
useFocusEffect(() => {
  const timer = setInterval(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, 3000);
  return () => clearInterval(timer);
});
```

**Why we use `useFocusEffect` instead of `useEffect`:**
- **Automatic pause/resume**: The timer automatically pauses when the user navigates away from the screen and resumes when they return
- **Prevents memory leaks**: Unlike `useEffect`, which only runs cleanup on unmount, `useFocusEffect` cleanup runs every time the screen loses focus (tab change, navigation away)
- **Background efficiency**: Prevents the slider from continuing to cycle through images when the user is on another tab or screen
- **Better UX**: Images don't wastefully animate while the user isn't viewing them

### Animation with `Animated.View` (crossfade between two images)
```typescript
const [current, setCurrent] = useState(0);
const [prev, setPrev] = useState(0);
const opacity = useRef(new Animated.Value(0)).current;
const currentRef = useRef(0);

useEffect(() => {
  opacity.setValue(0);
  Animated.timing(opacity, {
    toValue: 1,
    duration: 350,
    useNativeDriver: true,
  }).start();
}, [current, opacity]);

return (
  <View style={{ width: "100%", maxWidth: 320, aspectRatio: 9 / 16, alignSelf: "center" }}>
    <Animated.View
      style={{
        position: "absolute",
        inset: 0,
        opacity: opacity.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      }}
    >
      <Image source={images[prev]} style={{ width: "100%", height: "100%" }} contentFit="contain" />
    </Animated.View>
    <Animated.View
      style={{
        position: "absolute",
        inset: 0,
        opacity: opacity.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
      }}
    >
      <Image source={images[current]} style={{ width: "100%", height: "100%" }} contentFit="contain" />
    </Animated.View>
  </View>
);
```

**Why we use two overlapping `Animated.View` with interpolated opacity:**
- **True crossfade**: The outgoing image fades out (1→0) while the incoming image fades in (0→1) simultaneously
- **Native performance**: `useNativeDriver: true` runs the animation on the UI thread
- **Compatible**: Works with React Native 0.81.5 where `Animated.CrossFade` is unavailable
- **Smooth transition**: 350ms sequential interpolation provides a clean visual handoff between slides

**Key detail:** `useEffect` must depend on `[current, opacity]`, not just `[opacity]`, otherwise the animation only runs once on mount and never triggers on slide change.

## Alternative Approaches Considered

1. **`setInterval` in `useEffect`**: Works but continues running in background when screen is not focused
2. **`react-native-reanimated`**: More powerful but overkill for this simple transition; `Animated.View` is sufficient
3. **Opacity manual animation without Animated**: Would be JS-thread dependent; using `Animated` with `useNativeDriver` ensures 60fps

## Key Imports Required
```typescript
import { Animated, View, Image } from "react-native";
import { useRef } from "react";
import { useFocusEffect } from "expo-router";
```

# Scroll-to-Section Pattern (recommended)

Use `onLayout` + `useState` in the parent to store each section's `layout.y`, then call `scrollTo({ y })` with those values. This is the most reliable pattern in React Native because `layout.y` is already relative to the `ScrollView` content, which is exactly what `scrollTo` expects.

## Component Location
`app/(tabs)/suscripcion.tsx` - `Suscripcion()` function

### Refs for positions and scroll (no stale state)
```tsx
const scrollViewRef = useRef<ScrollView>(null)
const positions = useRef<Record<string, number>>({})

const scrollTo = (section: string) => {
  const y = positions.current[section]
  if (y !== undefined) {
    scrollViewRef.current?.scrollTo({ y, animated: true })
  }
}
```

### Section View with `onLayout`
```tsx
<View
  onLayout={(event) => { positions.current["medio"] = event.nativeEvent.layout.y }}
  style={{ ... }}
>
  <Medio height={height} />
</View>
```

### Button that scrolls to a section
```tsx
<Pressable onPress={() => scrollTo("medio")}>
  <Text>Ir a Medio</Text>
</Pressable>
```

**Why refs over state:** `positions.current` always holds the latest value across renders without triggering re-renders. `useState` causes stale closures where the same `y` is captured across multiple clicks.
