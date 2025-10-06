import Env from "../api/Helpers/Env";

declare module "cloudflare:test" {
	interface ProvidedEnv extends Env {
	}
}
