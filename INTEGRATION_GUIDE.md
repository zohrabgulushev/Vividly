# Vividly App: External Features Integration Guide

This guide provides step-by-step instructions for developers to implement the external services required for launch: Payment Processing, Apple Sign-In, Live Video Streaming (Tutors), and Push Notifications.

---

## 1. Payment Gateway Integration (Stripe & Local Azeri Banks)

Vividly monetizes through purchasing conversational minute packages in **AZN** (e.g., 30-minute packages, where 1-on-1 private calls consume minutes at 2x rate, and group calls consume at 1x rate).

### Option A: Stripe Integration (Global Standard)
We recommend using the official `@stripe/stripe-react-native` package.

1. **Install Dependencies**:
   ```bash
   npx expo install @stripe/stripe-react-native
   ```
2. **Initialize Stripe SDK**:
   Wrap your app root component (`src/app/_layout.tsx`) with the `<StripeProvider>`:
   ```tsx
   import { StripeProvider } from '@stripe/stripe-react-native';

   export default function RootLayout() {
     return (
       <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
         <Stack />
       </StripeProvider>
     );
   }
   ```
3. **Trigger the Checkout Sheet** in `src/app/top-up.tsx`:
   - Send package details (price, currency: `AZN`) to your backend (e.g., a Supabase Edge Function).
   - The backend initializes a Stripe PaymentIntent and returns the `paymentIntentClientSecret`.
   - Present the Stripe payment sheet on the mobile device:
     ```tsx
     import { useStripe } from '@stripe/stripe-react-native';

     const { initPaymentSheet, presentPaymentSheet } = useStripe();

     const handleCheckout = async (packageId: string) => {
       // 1. Fetch payment sheet parameters from your backend/edge function
       const response = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ packageId, userId: user.id }),
       });
       const { paymentIntent } = await response.json();

       // 2. Initialize Payment Sheet
       const { error } = await initPaymentSheet({
         paymentIntentClientSecret: paymentIntent,
         merchantDisplayName: 'Vividly ESL',
         currencyCode: 'AZN',
       });

       if (!error) {
         // 3. Present Sheet
         const { error: presentError } = await presentPaymentSheet();
         if (!presentError) {
           // Success: Increment minutes_balance in profiles
           Alert.alert('Payment Successful!', 'Your minute balance has been topped up.');
         }
       }
     };
     ```

### Option B: Local Azerbaijani Gateways (Unibank / Kapital Bank API / Birleşik Ödeme)
To comply with local CBAR (Central Bank of Azerbaijan) regulations, integrations with local acquiring banks (Unibank/Kapital) are performed via a secure WebView redirect or gateway API:
1. **Initialize Purchase**: Send a POST request from the app backend to the bank API (e.g., Unibank's card clearance API) specifying amount in AZN, return URLs, and description.
2. **Redirect to Payment Web UI**: The API returns a payment URL (`redirect_url`). Open this URL in the app using `expo-web-browser` or `react-native-webview`:
   ```tsx
   import * as WebBrowser from 'expo-web-browser';

   const handleLocalPayment = async (packageId: string) => {
     const res = await callLocalBankAcquirer({ packageId });
     const result = await WebBrowser.openBrowserAsync(res.redirect_url);
     // Check redirect URLs or poll the server/webhook for status completion
   };
   ```
3. **Handle Callback Webhook**: The gateway hits your Supabase Edge Function Webhook when payment completes. The Edge Function runs a database query to credit `minutes_balance` on the user's profile.

---

## 2. Apple Sign-In Integration

To publish on the iOS App Store, Apple Sign-In is **mandatory** since the app supports third-party (Google/Email) authentication.

### Apple Developer Console Configuration
1. Log in to [Apple Developer Portal](https://developer.apple.com/).
2. Go to **Certificates, Identifiers & Profiles** -> **Identifiers** -> Select your App ID.
3. Check the checkbox for **Sign In with Apple**. Click save.
4. Go to **Keys** -> Click "+" to create a new key -> Name it (e.g., "Supabase Auth Key") -> Check **Sign In with Apple** -> Configure and choose your App ID. Download the `.p8` key file and copy the **Key ID** and your Apple **Team ID**.

### Supabase Dashboard Configuration
1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication** -> **Providers** -> **Apple**.
3. Toggle "Enable Apple Provider".
4. Upload your `.p8` file, enter Key ID, Team ID, and your App Bundle ID. Click save.

### Client Code Implementation (`src/app/(auth)/login.tsx` / `register.tsx`)
Expo simplifies this using the official Apple authentication package:
1. **Install Dependencies**:
   ```bash
   npx expo install expo-apple-authentication
   ```
2. **Render Button & Handle Sign In**:
   ```tsx
   import * as AppleAuthentication from 'expo-apple-authentication';

   const handleAppleSignIn = async () => {
     try {
       const credential = await AppleAuthentication.signInAsync({
         requestedScopes: [
           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
           AppleAuthentication.AppleAuthenticationScope.EMAIL,
         ],
       });
       
       if (credential.identityToken) {
         // Send the Apple Identity Token to Supabase Auth
         const { data, error } = await supabase.auth.signInWithIdToken({
           provider: 'apple',
           token: credential.identityToken,
         });
         
         if (data) {
           router.replace('/(tabs)/learn');
         }
       }
     } catch (e: any) {
       if (e.code !== 'ERR_REQUEST_CANCELED') {
         console.error(e);
       }
     }
   };
   ```

---

## 3. Video & Audio Streaming (Agora / Daily.co)

Tutor video/audio calls are built in `src/app/active-call.tsx`.

### Agora SDK Integration (Recommended for Quality)
Agora offers low-latency RTC (Real-Time Communication) SDK optimized for mobile apps.

1. **Install Dependencies**:
   ```bash
   npm install react-native-agora
   ```
2. **Integrate SDK** in `src/app/active-call.tsx`:
   - Initialize Agora Engine.
   - Join channel using an App ID and a dynamically generated Token from your backend (for security).
   - Render local video and remote tutor video stream.
   ```tsx
   import createAgoraRtcEngine, { ChannelProfileType, ClientRoleType, RtcConnection, IRtcEngine } from 'react-native-agora';

   const engine = useRef<IRtcEngine | null>(null);

   useEffect(() => {
     // 1. Initialize engine
     engine.current = createAgoraRtcEngine();
     engine.current.initialize({ appId: process.env.EXPO_PUBLIC_AGORA_APP_ID! });

     // 2. Setup listeners
     engine.current.addListener('onJoinChannelSuccess', (connection, elapsed) => {
       console.log('Joined video call room successfully');
     });

     engine.current.addListener('onUserJoined', (connection, remoteUid, elapsed) => {
       console.log('Tutor joined call stream', remoteUid);
     });

     engine.current.addListener('onLeaveChannel', (connection, stats) => {
       console.log('Left call');
     });

     // 3. Join the call
     engine.current.enableVideo();
     engine.current.startPreview();
     engine.current.joinChannel(token, channelName, uid, {
       channelProfile: ChannelProfileType.ChannelProfileCommunication,
       clientRoleType: ClientRoleType.ClientRoleBroadcaster,
     });

     return () => {
       engine.current?.leaveChannel();
       engine.current?.release();
     };
   }, []);
   ```

3. **Time-Based Charging (Supabase Connection)**:
   - When the call completes, call `endCall(callId, durationSeconds)` from `src/services/calls.ts`. This deducts the billed minutes from the profile's `minutes_balance` using the configured call type multiplier (2x for private, 1x for group calls).

---

## 4. Push Notifications (Expo Notifications & Firebase)

To notify users of scheduled lessons, league leaderboard rank drops, or incoming tutor messages, configure native push notifications.

1. **Install expo-notifications**:
   ```bash
   npx expo install expo-notifications expo-device
   ```
2. **Write Token Registration Hook** (run on app startup or onboarding completion):
   ```tsx
   import * as Notifications from 'expo-notifications';
   import * as Device from 'expo-device';

   Notifications.setNotificationHandler({
     handleNotification: async () => ({
       shouldShowAlert: true,
       shouldPlaySound: true,
       shouldSetBadge: false,
     }),
   });

   export async function registerForPushNotificationsAsync() {
     let token;
     if (Device.isDevice) {
       const { status: existingStatus } = await Notifications.getPermissionsAsync();
       let finalStatus = existingStatus;
       if (existingStatus !== 'granted') {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
       }
       if (finalStatus !== 'granted') {
         console.warn('Failed to get push token for push notifications!');
         return;
       }
       token = (await Notifications.getExpoPushTokenAsync({
         projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
       })).data;
     } else {
       console.log('Must use physical device for Push Notifications');
     }
     return token;
   }
   ```
3. **Store Token in Supabase**:
   Create a table `user_push_tokens (user_id UUID, token TEXT, device_type TEXT, updated_at TIMESTAMP)` in Supabase, and insert the token returned by the function above.
4. **Triggering Notifications**:
   Setup database webhooks or Edge Functions in Supabase to trigger push requests to the Expo notification server (`https://exp.host/--/api/v2/push/send`) whenever a specific event occurs (e.g. lesson schedule reminder or league status update).
