# Requirements Document: Mobile App Features for BenGift Clothing

## Introduction

This requirements document specifies the functional and non-functional requirements for enhancing the BenGift Clothing tailor management system with mobile-first capabilities. The system will support offline operation with synchronization, push notifications for job updates, camera optimization for measurement capture, and a PWA install prompt to encourage app installation. These features transform the existing Progressive Web App into a fully mobile-capable solution suitable for tailoring shops with intermittent connectivity.

## Glossary

- **System**: The BenGift Clothing tailor management application (React frontend + Node.js backend + Supabase database)
- **SyncManager**: Component responsible for managing offline data storage and synchronization
- **IndexedDB**: Browser-based database for offline data storage
- **PushNotificationManager**: Component managing push notification subscriptions and delivery
- **CameraCapture**: Component providing optimized camera interface for photo capture
- **ImageCompressor**: Service for compressing images to reduce file size
- **Sync_Queue**: IndexedDB store containing pending operations awaiting synchronization
- **Service_Worker**: Background script managing offline functionality and push notifications
- **VAPID**: Voluntary Application Server Identification for Web Push protocol
- **PWA**: Progressive Web App - web application with native app-like capabilities
- **Install_Prompt**: Browser API event that allows prompting users to install the PWA

## Requirements

### Requirement 1: PWA Install Prompt

**User Story:** As a user visiting the web app, I want to see a prompt asking me to install the app or continue in browser, so that I can easily add the app to my device for quick access.

#### Acceptance Criteria

1. WHEN a user visits the web app for the first time, THE System SHALL display an install prompt banner within 3 seconds
2. THE Install_Prompt SHALL present two clear options: "Install App" and "Continue in Browser"
3. WHEN a user clicks "Install App", THE System SHALL trigger the browser's native PWA install dialog
4. WHEN a user clicks "Continue in Browser", THE System SHALL dismiss the prompt and store the user's preference
5. WHEN a user has previously dismissed the prompt, THE System SHALL not show the prompt again for 7 days
6. WHEN the PWA is already installed, THE System SHALL not display the install prompt
7. WHEN the browser does not support PWA installation, THE System SHALL not display the install prompt
8. THE Install_Prompt SHALL include the app icon, app name, and a brief description of benefits
9. WHEN the user successfully installs the app, THE System SHALL track the installation event for analytics

### Requirement 2: Offline Data Storage

**User Story:** As a tailor shop manager, I want to create and update jobs even when internet connection is unavailable, so that I can continue working without interruption.

#### Acceptance Criteria

1. WHEN a user creates a job while offline, THE System SHALL store the job data in IndexedDB with syncStatus 'pending'
2. WHEN a user updates a job while offline, THE System SHALL store the updated data in IndexedDB with syncStatus 'pending'
3. WHEN a user deletes a job while offline, THE System SHALL mark the job for deletion in IndexedDB with syncStatus 'pending'
4. THE System SHALL store job data including jobNo, customerName, orderDate, deliveryDate, items, totalAmount, advancePaid, balance, and status
5. WHEN offline operations are queued, THE System SHALL add entries to the Sync_Queue with operation type, data, and timestamp
6. THE System SHALL maintain separate IndexedDB stores for jobs, customers, workers, fabrics, and images
7. WHEN IndexedDB storage quota is exceeded, THE System SHALL notify the user and prevent new offline operations

### Requirement 3: Background Synchronization

**User Story:** As a tailor shop manager, I want my offline changes to automatically sync when internet connection is restored, so that I don't have to manually trigger synchronization.

#### Acceptance Criteria

1. WHEN network connectivity is restored, THE System SHALL register a background sync event with the Service_Worker
2. WHEN background sync is triggered, THE SyncManager SHALL retrieve all items from Sync_Queue with status 'pending'
3. FOR each pending item, THE SyncManager SHALL execute the corresponding API operation (CREATE, UPDATE, or DELETE)
4. WHEN a sync operation succeeds, THE SyncManager SHALL mark the item as 'synced' and update local data with server response
5. WHEN a sync operation fails, THE SyncManager SHALL increment the retry count and reset status to 'pending'
6. WHEN retry count exceeds 5 attempts, THE SyncManager SHALL mark the item as 'failed' and log the error
7. WHEN all pending items are processed, THE System SHALL emit a sync complete event to update the UI
8. THE SyncManager SHALL batch sync operations with a maximum of 10 items per batch

### Requirement 4: Conflict Resolution

**User Story:** As a tailor shop manager, I want the system to handle conflicts when the same job is modified offline and online, so that I don't lose important data.

#### Acceptance Criteria

1. WHEN a sync operation detects conflicting changes, THE SyncManager SHALL mark the item with syncStatus 'conflict'
2. WHEN using last-write-wins strategy, THE SyncManager SHALL compare timestamps and keep the most recent version
3. WHEN local timestamp is greater than server timestamp, THE SyncManager SHALL push local changes to the server
4. WHEN server timestamp is greater than local timestamp, THE SyncManager SHALL update local data with server data
5. WHEN conflict resolution is complete, THE SyncManager SHALL mark the item as 'synced' and record the resolution timestamp
6. THE SyncManager SHALL preserve both local and server versions during conflict detection for potential manual resolution

### Requirement 5: Offline UI Indicators

**User Story:** As a user, I want to see clear indicators when I'm working offline and when data is syncing, so that I understand the current state of my data.

#### Acceptance Criteria

1. WHEN the device is offline, THE System SHALL display an offline mode banner showing the number of pending sync items
2. WHEN sync is in progress, THE System SHALL display a syncing indicator with visual feedback
3. WHEN sync completes successfully, THE System SHALL show a success notification
4. WHEN sync fails, THE System SHALL show an error notification with retry option
5. THE System SHALL update the pending count in real-time as operations are queued and synced

### Requirement 6: Push Notification Subscription

**User Story:** As a tailor shop manager, I want to enable push notifications for job updates, so that I receive timely alerts about important events.

#### Acceptance Criteria

1. WHEN a user enables notifications in settings, THE PushNotificationManager SHALL request notification permission from the browser
2. WHEN notification permission is granted, THE PushNotificationManager SHALL create a push subscription using VAPID keys
3. WHEN a push subscription is created, THE System SHALL send the subscription data to the backend API
4. THE backend SHALL store the subscription in the push_subscriptions table with user_id, endpoint, keys, and active status
5. WHEN a user disables notifications, THE PushNotificationManager SHALL unsubscribe and mark the subscription as inactive
6. WHEN Push API is not supported, THE System SHALL display a message explaining browser compatibility requirements

### Requirement 7: Job Status Notifications

**User Story:** As a tailor shop manager, I want to receive notifications when job status changes, so that I stay informed about work progress.

#### Acceptance Criteria

1. WHEN a job status changes, THE backend SHALL query active push subscriptions for relevant users
2. FOR each active subscription, THE backend SHALL send a push notification with job details
3. THE notification SHALL include job number, customer name, old status, and new status
4. THE notification SHALL provide actions: "View Job" and "Dismiss"
5. WHEN a user clicks "View Job", THE System SHALL open the app and navigate to the job details page
6. THE backend SHALL log each notification attempt in the notification_logs table with status 'sent' or 'failed'

### Requirement 8: Trial and Delivery Reminders

**User Story:** As a tailor shop manager, I want to receive reminders for upcoming trials and deliveries, so that I don't miss important appointments.

#### Acceptance Criteria

1. THE backend SHALL run a scheduled job daily to check for trials and deliveries occurring the next day
2. WHEN a trial is scheduled for the next day, THE backend SHALL send a trial reminder notification to all active subscriptions
3. THE trial reminder SHALL include job number, customer name, trial date, and customer phone number
4. THE trial reminder SHALL provide actions: "View Job", "Call Customer", and "Dismiss"
5. WHEN a delivery is due the next day, THE backend SHALL send a delivery alert notification
6. THE delivery alert SHALL include job number, customer name, delivery date, and outstanding balance
7. THE delivery alert SHALL provide actions: "View Job", "Mark Delivered", and "Dismiss"
8. WHEN a user clicks "Mark Delivered", THE System SHALL update the job status to 'Delivered' via API

### Requirement 9: Notification Display and Interaction

**User Story:** As a user, I want notifications to be displayed clearly with relevant information and actions, so that I can quickly respond to important events.

#### Acceptance Criteria

1. WHEN a push notification is received, THE Service_Worker SHALL display it using the browser's notification API
2. THE notification SHALL include a title, body text, app icon, and badge
3. THE notification SHALL support custom actions based on notification type
4. WHEN a user clicks a notification, THE Service_Worker SHALL focus an existing app window or open a new one
5. WHEN a user clicks a notification action, THE Service_Worker SHALL execute the corresponding action handler
6. THE notification SHALL use vibration pattern [200, 100, 200] for attention
7. WHEN a notification requires user interaction, THE System SHALL set requireInteraction to true

### Requirement 10: Camera Access and Preview

**User Story:** As a tailor, I want to capture measurement photos using my device camera, so that I can document customer measurements visually.

#### Acceptance Criteria

1. WHEN a user opens the camera interface, THE CameraCapture SHALL request camera permission
2. WHEN camera permission is granted, THE CameraCapture SHALL access the device camera using MediaStream API
3. THE CameraCapture SHALL display a live camera preview to the user
4. THE CameraCapture SHALL default to the rear camera (environment facing mode) for measurement photos
5. THE CameraCapture SHALL provide a button to switch between front and rear cameras
6. WHEN camera permission is denied, THE CameraCapture SHALL display an error message and provide alternative file upload option
7. THE CameraCapture SHALL support zoom controls for detailed measurement capture

### Requirement 11: Photo Capture and Compression

**User Story:** As a tailor, I want captured photos to be automatically compressed, so that they don't consume excessive storage space or bandwidth.

#### Acceptance Criteria

1. WHEN a user captures a photo, THE CameraCapture SHALL render the video frame to a canvas element
2. THE CameraCapture SHALL pass the captured image to the ImageCompressor for processing
3. THE ImageCompressor SHALL compress the image to a target size of 500KB with 10% tolerance
4. THE ImageCompressor SHALL use binary search to find optimal quality setting within 10 iterations
5. THE ImageCompressor SHALL limit image dimensions to maximum 1920x1080 pixels
6. THE ImageCompressor SHALL preserve the original aspect ratio during compression
7. THE ImageCompressor SHALL convert images to JPEG format for optimal compression
8. WHEN compression is complete, THE System SHALL return the compressed blob with metadata including original size, compressed size, and compression ratio

### Requirement 12: Image Storage and Synchronization

**User Story:** As a tailor, I want captured photos to be stored reliably whether I'm online or offline, so that I don't lose important measurement documentation.

#### Acceptance Criteria

1. WHEN a photo is captured while online, THE ImageStorageManager SHALL upload it to Supabase Storage
2. WHEN a photo is captured while offline, THE ImageStorageManager SHALL store it in IndexedDB with syncStatus 'pending'
3. THE ImageStorageManager SHALL store image metadata including jobId, type, timestamp, and syncStatus
4. WHEN network connectivity is restored, THE ImageStorageManager SHALL sync pending images to Supabase Storage
5. WHEN image upload succeeds, THE ImageStorageManager SHALL update the local record with the cloud URL and mark as 'synced'
6. THE ImageStorageManager SHALL delete local image data after successful sync to free storage space
7. THE ImageStorageManager SHALL track storage quota usage and warn users when approaching 90% capacity

### Requirement 13: Image Cache Management

**User Story:** As a user, I want the system to automatically manage image cache, so that my device doesn't run out of storage space.

#### Acceptance Criteria

1. THE ImageStorageManager SHALL implement automatic cache cleanup for images older than 30 days
2. WHEN storage quota exceeds 90%, THE ImageStorageManager SHALL trigger immediate cache cleanup
3. THE cache cleanup SHALL prioritize deletion of synced images over pending images
4. THE ImageStorageManager SHALL provide a manual cache clear option in settings
5. WHEN cache is cleared, THE System SHALL display the amount of storage space freed
6. THE ImageStorageManager SHALL preserve thumbnail versions of cleared images for reference

### Requirement 14: Data Encryption for Offline Storage

**User Story:** As a business owner, I want sensitive customer data to be encrypted when stored offline, so that customer privacy is protected on shared devices.

#### Acceptance Criteria

1. WHEN storing customer phone numbers in IndexedDB, THE System SHALL encrypt them using AES-GCM encryption
2. WHEN storing payment information in IndexedDB, THE System SHALL encrypt it using AES-GCM encryption
3. THE System SHALL use Web Crypto API for encryption operations
4. THE System SHALL generate encryption keys using secure random number generation
5. WHEN a user logs out, THE System SHALL clear all encryption keys from memory
6. WHEN retrieving encrypted data, THE System SHALL decrypt it before displaying to the user

### Requirement 15: Session Timeout and Security

**User Story:** As a business owner, I want the system to automatically log out inactive users, so that unauthorized access is prevented on shared devices.

#### Acceptance Criteria

1. THE System SHALL track user activity including clicks, keyboard input, and touch events
2. WHEN no user activity is detected for 30 minutes, THE System SHALL automatically log out the user
3. WHEN logging out, THE System SHALL clear sensitive data from IndexedDB
4. WHEN logging out, THE System SHALL preserve pending sync operations for the next login
5. THE System SHALL display a warning 2 minutes before automatic logout
6. WHEN a user dismisses the warning, THE System SHALL reset the inactivity timer

### Requirement 16: API Rate Limiting and Security

**User Story:** As a system administrator, I want API endpoints to be protected against abuse, so that system performance and security are maintained.

#### Acceptance Criteria

1. THE backend SHALL implement rate limiting of 100 requests per 15 minutes per IP address
2. WHEN rate limit is exceeded, THE backend SHALL return HTTP 429 status with retry-after header
3. THE backend SHALL implement additional rate limiting of 10 image uploads per minute per user
4. THE backend SHALL validate all input data against expected schemas before processing
5. THE backend SHALL use prepared statements for all database queries to prevent SQL injection
6. THE backend SHALL require valid JWT tokens for all authenticated endpoints
7. THE backend SHALL implement JWT token expiration of 15 minutes with refresh token rotation

### Requirement 17: Performance Optimization for Sync

**User Story:** As a user, I want data synchronization to be fast and efficient, so that I can quickly resume work after connectivity is restored.

#### Acceptance Criteria

1. THE SyncManager SHALL complete synchronization of 100 items in less than 10 seconds
2. THE SyncManager SHALL use IndexedDB transactions for atomic operations
3. THE SyncManager SHALL implement exponential backoff for retries with delays of 1s, 2s, 4s, 8s, 16s
4. THE SyncManager SHALL debounce sync triggers by 500ms to batch rapid changes
5. THE SyncManager SHALL use Web Workers for heavy sync operations to avoid blocking the UI
6. THE SyncManager SHALL limit concurrent sync operations to 5 at a time

### Requirement 18: Performance Optimization for Image Compression

**User Story:** As a user, I want image compression to be fast, so that I can quickly capture multiple measurement photos without delays.

#### Acceptance Criteria

1. THE ImageCompressor SHALL compress a 5MB image to 500KB in less than 2 seconds
2. THE ImageCompressor SHALL generate thumbnails in less than 500ms
3. THE ImageCompressor SHALL use OffscreenCanvas when available for better performance
4. THE ImageCompressor SHALL process images in a Web Worker to avoid blocking the UI
5. THE ImageCompressor SHALL limit concurrent compression operations to 2 to prevent memory issues
6. THE ImageCompressor SHALL support a queue of up to 10 images without causing UI lag

### Requirement 19: Browser Compatibility

**User Story:** As a user, I want the app to work on modern mobile browsers, so that I can use it on my preferred device.

#### Acceptance Criteria

1. THE System SHALL support Chrome/Edge version 90 and above
2. THE System SHALL support Firefox version 88 and above
3. THE System SHALL support Safari version 15.4 and above
4. THE System SHALL support Mobile Safari (iOS) version 16.4 and above
5. THE System SHALL support Chrome Android version 90 and above
6. WHEN a required API is not supported, THE System SHALL display a browser compatibility message
7. THE System SHALL gracefully degrade functionality when optional features are unavailable

### Requirement 20: Error Handling and Recovery

**User Story:** As a user, I want the system to handle errors gracefully and provide clear recovery options, so that I can resolve issues without losing data.

#### Acceptance Criteria

1. WHEN network failure occurs during sync, THE SyncManager SHALL preserve pending items and retry when online
2. WHEN IndexedDB quota is exceeded, THE System SHALL offer to clear cache and retry the operation
3. WHEN push subscription fails, THE System SHALL retry after 5 minutes and fall back to in-app notifications
4. WHEN camera access is denied, THE System SHALL provide instructions to enable camera in browser settings
5. WHEN image compression fails, THE System SHALL retry with lower quality settings or store uncompressed
6. WHEN a sync conflict is detected, THE System SHALL apply the configured resolution strategy and log the conflict
7. THE System SHALL log all errors to the console with sufficient context for debugging

