import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { handleError, ok } from "@/lib/api";

export async function GET() {
  try {
    await connectDB();
    const groups = await Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    return ok(groups.map((group) => ({ name: group._id, count: group.count })));
  } catch (error) {
    return handleError(error);
  }
}
