import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => ({
	test: {
		poolOptions: {
			workers: {
				wrangler: {
					configPath: "../wrangler.jsonc"
				}
			}
		},
	}
}));
