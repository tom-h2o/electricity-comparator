import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(request, response) {
    if (request.method === 'GET') {
        try {
            const data = await redis.get('electricity_data');
            return response.status(200).json(data || {
                consumption: 3500,
                contracts: [],
                currentContract: null
            });
        } catch (error) {
            console.error(error)
            return response.status(500).json({ error: 'Failed to fetch data' });
        }
    }

    if (request.method === 'POST') {
        try {
            await redis.set('electricity_data', request.body);
            return response.status(200).json({ success: true });
        } catch (error) {
            console.error(error)
            return response.status(500).json({ error: 'Failed to save data' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
