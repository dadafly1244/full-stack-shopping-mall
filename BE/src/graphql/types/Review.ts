import { objectType } from "nexus";

export const ReviewType = objectType({
  name: "Review",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("title");
    t.string("desc");
    t.nonNull.float("score");
    t.field("images_path", { type: "JSON" });
    t.nonNull.boolean("is_deleted");
    t.nonNull.string("user_id");
    t.nonNull.string("product_id");
    t.string("parent_review_id");
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });

    t.field("parentReview", {
      type: "Review",
      resolve: (parent, _, context) => {
        return context.prisma.review
          .findUnique({ where: { id: parent.id } })
          .parentReview();
      },
    });

    t.list.field("childReviews", {
      type: "Review",
      resolve: (parent, _, context) => {
        return context.prisma.review
          .findUnique({ where: { id: parent.id } })
          .childReviews();
      },
    });

    t.field("user", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.review
          .findUnique({ where: { id: parent.id } })
          .user();
      },
    });

    t.field("product", {
      type: "Product",
      resolve: (parent, _, context) => {
        return context.prisma.review
          .findUnique({ where: { id: parent.id } })
          .product();
      },
    });
  },
});
