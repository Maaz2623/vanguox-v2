import { createTRPCRouter, protectedProcedure } from "../init";

export const storesRouter = createTRPCRouter({
  createStore: protectedProcedure.query(async () => {}),
});
