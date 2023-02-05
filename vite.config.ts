import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from "path";

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			"@icons": path.resolve("./src/icons"), 
			"@components": path.resolve("./src/components"),
			"@stores": path.resolve("./src/stores"),
			"@util": path.resolve("./src/util"),
		}
	}
};

export default config;
