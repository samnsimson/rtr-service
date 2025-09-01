# Environment Configuration Example

Add these variables to your `.env` file:

```env
# Meilisearch Configuration
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your_master_key_here
MEILISEARCH_TIMEOUT=10000

# Optional: Set to true to enable debug logging
MEILISEARCH_DEBUG=false
```

## Getting Started with Meilisearch

1. **Install Meilisearch**:

   ```bash
   # Using Docker (recommended)
   docker run -p 7700:7700 getmeili/meilisearch:latest

   # Or download from https://docs.meilisearch.com/learn/getting_started/installation.html
   ```

2. **Get your API key**:
   - The default master key is displayed when you start Meilisearch
   - Or set a custom key: `docker run -p 7700:7700 -e MEILI_MASTER_KEY=your_key getmeili/meilisearch:latest`

3. **Test connection**:

   ```bash
   curl http://localhost:7700/health
   ```

4. **Access Meilisearch dashboard**:
   - Open http://localhost:7700 in your browser
   - Use your master key to access the dashboard
