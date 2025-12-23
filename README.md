# Capital Bikeshare Notifier

A TypeScript Express app that monitors Capital Bikeshare station availability and sends SMS notifications during weekday mornings.

## 🏗️ Project Structure

```
├── src/
│   ├── config/
│   │   └── index.ts          # Environment configuration
│   ├── services/
│   │   ├── bikeshare.ts      # Capital Bikeshare API client
│   │   ├── notifier.ts       # Twilio SMS notifications
│   │   └── scheduler.ts      # Cron-based scheduling
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── app.ts                # Main Express app
├── .env.example              # Environment template
├── .gitignore
├── package.json
└── tsconfig.json
```

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add:
- Your Twilio credentials (from https://console.twilio.com)
- Your home location (already set to 1609 13th St NW)
- Search radius (default: 500 meters)
- Your phone number

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

## 🧪 Testing

### Manual Trigger
Test the notification without waiting for the scheduled time:

```bash
curl -X POST http://localhost:3000/trigger-check
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 📱 How It Works

1. **Scheduler** runs once per day at 9:30 AM on weekdays
2. **Bikeshare Service** finds all stations within 500m of your location
3. **Bikeshare Service** fetches current availability for those stations
4. **Notifier Service** formats and sends SMS via Twilio
5. You receive a text like:
   ```
   Bike Availability:
   🚲 14th & R St NW (150m): 5 bikes
   🚲 15th & P St NW (280m): 3 bikes
   ❌ 13th & Q St NW (340m): 0 bikes
   ```

## 🔧 Configuration

Adjust the schedule or location in `.env`:
```
# Run once at 9:30 AM on weekdays
CRON_SCHEDULE=30 9 * * 1-5

# Your home location
HOME_LATITUDE=38.9138
HOME_LONGITUDE=-77.0319

# Search radius in meters
SEARCH_RADIUS_METERS=500
```

## 📝 Notes

- Station data updates every ~30 seconds from Capital Bikeshare
- Free Twilio trial accounts include test credits
- The app will keep running until stopped (Ctrl+C)
