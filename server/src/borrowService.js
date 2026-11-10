import {
  assertApproved,
  assertAvailableQuantity,
  assertBorrowerOwnsRequest,
  assertPending,
  assertPositiveQuantity,
} from "./domain/borrowRules.js";
import { badRequest, notFound } from "./errors.js";

const requestInclude = {
  item: true,
  borrower: { select: { id: true, email: true, displayName: true } },
  reviewer: { select: { id: true, email: true, displayName: true } },
};

export const createBorrowService = (db) => ({
  async listForUser(user) {
    return db.borrowRequest.findMany({
      where: user.role === "BORROWER" ? { borrowerId: user.id } : undefined,
      include: requestInclude,
      orderBy: { requestedAt: "desc" },
    });
  },

  async create(user, input) {
    assertPositiveQuantity(input.quantity);
    const item = await db.item.findUnique({ where: { id: input.itemId } });
    if (!item || !item.active) throw notFound("Active item not found.");
    assertAvailableQuantity(item.availableQuantity, input.quantity);

    return db.borrowRequest.create({
      data: {
        borrowerId: user.id,
        itemId: item.id,
        quantity: input.quantity,
        purpose: input.purpose.trim(),
      },
      include: requestInclude,
    });
  },

  async approve(user, requestId) {
    return db.$transaction(async (tx) => {
      const request = await tx.borrowRequest.findUnique({
        where: { id: requestId },
        include: { item: true },
      });
      if (!request) throw notFound("Borrow request not found.");
      assertPending(request.status);
      assertAvailableQuantity(request.item.availableQuantity, request.quantity);

      await tx.item.update({
        where: { id: request.itemId },
        data: { availableQuantity: { decrement: request.quantity } },
      });
      return tx.borrowRequest.update({
        where: { id: request.id },
        data: {
          status: "APPROVED",
          reviewerId: user.id,
          reviewedAt: new Date(),
          rejectionReason: null,
        },
        include: requestInclude,
      });
    });
  },

  async reject(user, requestId, reason) {
    if (!reason.trim()) throw badRequest("A rejection reason is required.");
    const request = await db.borrowRequest.findUnique({ where: { id: requestId } });
    if (!request) throw notFound("Borrow request not found.");
    assertPending(request.status);

    return db.borrowRequest.update({
      where: { id: request.id },
      data: {
        status: "REJECTED",
        reviewerId: user.id,
        reviewedAt: new Date(),
        rejectionReason: reason.trim(),
      },
      include: requestInclude,
    });
  },

  async returnItem(user, requestId) {
    return db.$transaction(async (tx) => {
      const request = await tx.borrowRequest.findUnique({ where: { id: requestId } });
      if (!request) throw notFound("Borrow request not found.");
      assertApproved(request.status);
      assertBorrowerOwnsRequest(request.borrowerId, user.id);

      await tx.item.update({
        where: { id: request.itemId },
        data: { availableQuantity: { increment: request.quantity } },
      });
      return tx.borrowRequest.update({
        where: { id: request.id },
        data: { status: "RETURNED", returnedAt: new Date() },
        include: requestInclude,
      });
    });
  },
});
