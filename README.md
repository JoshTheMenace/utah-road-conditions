# UDOT Road Conditions Web App

Real-time Utah road condition monitoring from traffic cameras, powered by Next.js and deployed on Vercel.

[DEMO](https://roads.joshthemenace.com)

<img width="1815" height="907" alt="image" src="https://github.com/user-attachments/assets/d732ff9c-d0a3-491b-9b29-c141f321c2fb" />

## Features

- 🗺️ **Interactive Map** - View all Utah traffic cameras with color-coded safety levels
- 🔄 **Auto-Refresh** - Updates every 60 seconds automatically
- 📊 **Live Statistics** - Real-time counts of safe/caution/hazardous conditions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast & Lightweight** - Optimized for performance

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure API URL

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend API URL:

```
API_URL=http://YOUR_BACKEND_API:5000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
udot-web/
├── app/
│   ├── components/
│   │   ├── RoadConditionsMap.tsx  # Leaflet map component
│   │   └── StatsPanel.tsx         # Statistics sidebar
│   ├── globals.css                # Global styles + Tailwind
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page with data fetching
├── public/                        # Static assets
├── .env.local                     # Environment variables (create this!)
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind CSS config
└── package.json                   # Dependencies
```

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **React Leaflet** - Interactive maps
- **SWR** - Data fetching with auto-refresh
- **Tailwind CSS** - Styling

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_URL` | Backend API endpoint | `http://localhost:5000` |

## API Endpoints Used

The app fetches from your backend API:

- `GET /api/conditions` - All camera data + statistics
- Auto-refreshes every 60 seconds

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Using Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable: `API_URL`
5. Deploy!

### Important: Set Environment Variable

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add: `API_URL` = `http://YOUR_BACKEND_API:5000`
3. Redeploy

## Development

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Customization

### Change Refresh Interval

Edit `app/page.tsx`:

```typescript
const REFRESH_INTERVAL = 60000 // Change to desired milliseconds
```

### Change Map Styling

Edit `app/components/RoadConditionsMap.tsx` - change the TileLayer URL:

```typescript
// Dark mode example
url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
```

### Adjust Marker Colors

Edit `SAFETY_COLORS` in `app/components/RoadConditionsMap.tsx`:

```typescript
const SAFETY_COLORS = {
  safe: '#00FF00',      // Green
  caution: '#FFA500',   // Orange
  hazardous: '#FF0000', // Red
  unknown: '#808080'    // Gray
}
```

## Troubleshooting

### "Connection Error" Message

- Check that backend API server is running
- Verify `.env.local` has correct API endpoint
- Check backend firewall allows port 5000
- Ensure CORS is enabled on backend

### Map Not Loading

- Check browser console for errors
- Leaflet requires client-side rendering (already handled with `dynamic`)
- Check that data has valid lat/lon coordinates

### Build Fails on Vercel

- Make sure all dependencies are in `package.json`
- Check that `API_URL` is set in Vercel
- Review build logs for specific errors

## Security Notes

### HTTPS Requirement

If deploying to Vercel (HTTPS), your backend API should also use HTTPS to avoid mixed content warnings. Options:

1. **Use Cloudflare Tunnel** (recommended, free)
2. **Use nginx with Let's Encrypt**
3. **Use Caddy** (auto HTTPS)

### CORS

The Flask API (`api_server.py`) already includes CORS headers to allow requests from any origin. For production, you may want to restrict this to your Vercel domain only.

## Performance

- **Auto-refresh**: 60 seconds (configurable)
- **Data caching**: SWR handles caching and deduplication
- **Map rendering**: Optimized with React Leaflet
- **Build size**: ~500KB gzipped

## License

Same as parent project.

## Support

For issues related to:
- **Web app**: Check this README
- **Backend API**: See backend deployment documentation
- **Classification pipeline**: See backend optimization documentation
