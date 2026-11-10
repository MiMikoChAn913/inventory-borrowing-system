import { badRequest, conflict, forbidden } from "../errors.js";

export const assertPositiveQuantity = (quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw badRequest("Quantity must be a positive whole number.");
  }
};

export const assertAvailableQuantity = (available, requested) => {
  assertPositiveQuantity(requested);
  if (available < requested) {
    throw conflict("The requested quantity is not available.");
  }
};

export const assertPending = (status) => {
  if (status !== "PENDING") {
    throw conflict("Only a pending request can be reviewed.");
  }
};

export const assertApproved = (status) => {
  if (status !== "APPROVED") {
    throw conflict("Only an approved request can be returned.");
  }
};

export const assertBorrowerOwnsRequest = (requestBorrowerId, currentUserId) => {
  if (requestBorrowerId !== currentUserId) {
    throw forbidden("A borrower may return only their own request.");
  }
};
