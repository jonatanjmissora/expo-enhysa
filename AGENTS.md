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
