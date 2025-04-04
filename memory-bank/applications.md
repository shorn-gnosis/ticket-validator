# Applications

The project consists of three main applications, each serving a different purpose in the ticket validation ecosystem.

## Staff Validator App

**Repository**: [ticket-validator](https://github.com/shorn-gnosis/ticket-validator)

**Purpose**: For event staff to validate attendee tickets at the venue entrance.

**Key Features**:
- QR code scanning for quick wallet address input
- Real-time blockchain validation
- Debug mode for troubleshooting
- Simple pass/fail interface for quick decisions

**Implementation Details**:
- Uses react-qr-scanner for camera integration
- Includes a manual input option as fallback
- Deployed to GitHub Pages for easy access on mobile devices

## User Validator App

**Repository**: [ticket-validator-user](https://github.com/shorn-gnosis/ticket-validator-user)

**Purpose**: For attendees to verify their own ticket status before the event.

**Key Features**:
- Self-service ticket validation
- "Purchase Ticket" button for invalid tickets
- Support email contact option
- Mobile-friendly interface

**Implementation Details**:
- Simplified interface focused on self-service
- Includes purchase link for users without valid tickets
- Same core validation logic as the staff app

## End User App

**Location**: `/end-user-app` directory in the main repository

**Purpose**: Alternative implementation of the user-facing validator.

**Key Features**:
- Similar functionality to the User Validator App
- Different UI design
- Used for testing alternative approaches

## Differences Between Apps

1. **Staff vs. User Apps**:
   - Staff app includes QR scanning
   - User app includes purchase options
   - Staff app has debug mode
   - User app has support contact information

2. **Validation Logic**:
   - All apps use the same core validation approach
   - All connect to the same NFT contract
   - All handle case sensitivity in the same way

3. **Deployment**:
   - All apps are deployed to GitHub Pages
   - Each has its own repository or directory
   - All use the same build process (Vite)
