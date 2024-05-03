import { Budget } from "@/models/budget.model";

const SERVICE_TYPES = {
    Account: Symbol.for("Account"),
    Role: Symbol.for("Role"),
    Wallet: Symbol.for("Wallet"),
    User: Symbol.for("User"),
    Category: Symbol.for("Category"),
    Budget: Symbol.for("Budget"),
};

export { SERVICE_TYPES };