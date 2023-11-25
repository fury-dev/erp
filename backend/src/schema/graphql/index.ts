const GraphqlSchema = `#graphql

type Price{
    currency:String
    amount:String
}

type  Product{
    id:ID!
    distributorPrice:Price!
    sellerPrice:Price!
    size:String
    createdAt:String!
    updatedAt:String!
}

type User{
    email:String
    password:String
    username:String
}
type Expense{
    id:ID!
    expenseType:String!
    amount:Price
    cashInBank:Price
    cashInHand:Price
    pnl:Price
    createdAt:String!
    updatedAt:String!
}

type Order{
    id:ID!
    customerName:String!
    orderDate:String!
    orderType:String!
    amount:Price
    product:Product
    status:String
    paymentStatus:Boolean!
    deliveryDate:String
    createdAt:String!
    updatedAt:String!
}

type Query{
    orders:[Order]
    orderSelection(id:[ID!]):[Order]
    expenses:[Expense]
    expenseSelection(id:[ID!]):[Expense]
    products:[Product]
    productSelection(id:[ID!]):[Product]
}
type Mutation{
    addProduct(product:ProductValue!):Product
    updateProduct(product:ProductValue!):Product
    deleteProduct(id:ID!):[Product]
    addOrder(order:OrderValue!):Order
    updateOrder(order:OrderValue!):Order
    deleteOrder(id:ID!):[Order]
    addExpense(expense:ExpenseValue!):Expense
    updateExpense(expense:ExpenseValue!):Expense
    deleteExpense(id:ID!):[Expense]
    registerUser(user:UserRegisterValue!):String
    loginUser(user:UserLoginValue!):String

}

input ProductValue{
    expenseType:String
    amount:PriceValue
    cashInBank:PriceValue
    cashInHand:PriceValue
}
input ExpenseValue{
    distributerPrice:PriceValue
    sellerPrice:PriceValue
    size:String
}
input OrderValue{
    customerName:String
    orderDate:String
    orderType:String
    amount:PriceValue
    productId:ID!
    status:String
    paymentStatus:Boolean
    deliveryDate:String

}

input UserLoginValue{
    email:String
    password:String
}

input UserRegisterValue{
    email:String!
    password:String!
    username:String
}

input PriceValue{
    currency:String
    amount:String
}
`;

export { GraphqlSchema };
