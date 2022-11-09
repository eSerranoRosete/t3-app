import { router, publicProcedure } from "../trpc";

export const productRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
});
