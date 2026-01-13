import { testProductScoutSkeleton } from "./services/productscoutGenerator.js";

async function run() {
  const result = await testProductScoutSkeleton({ lang: "fr" });
  console.log(result);
}

run();
