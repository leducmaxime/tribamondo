/* eslint-disable */
declare namespace Cloudflare {
	interface GlobalProps {
		mainModule: typeof import("./src/worker");
	}
	interface Env {
		ENVIRONMENT: "production";
		ASSETS: Fetcher;
		DB: D1Database;
	}
}
interface Env extends Cloudflare.Env {}
