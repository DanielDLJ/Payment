import { development } from "./environment/dev.config";
import { production } from "./environment/prod.config";

export const configuration =
  process.env.NODE_ENV === production.name ? production : development;
