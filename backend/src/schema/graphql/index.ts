const GraphqlSchema = `#graphql

type Price{
    currency:String
    amount:Int
}

type  Product{
    id:ID!
    productId:Int
    name: String
    image:String
    versionId:Int
    distributorPrice:Price!
    sellerPrice:Price!
    size:[String]
    inStock: Boolean
    createdAt:String!
    updatedAt:String!
}

type User{
    email:String
    password:String
    username:String
}
type Expense{
    id:ID
    expenseType:String
    amount:Price
    expenseId:Int
    versionId:Int
    cashInBank:Price
    cashInHand:Price
    pnl:Price
    note:String
    operationType:String
    createdAt:String
    updatedAt:String
}

type Address{
    address:String
    pincode:Int
    city:String
    state:String
    country:String
}
type Order{
    id:ID
    customerName:String!
    versionId:Int
    orderId:Int
    orderDate:String!
    orderType:String!
    amount:Price
    productId:String
    product:Product
    status:String
    location:Address
    paymentStatus:Boolean!
    deliveryDate:String
    createdAt:String
    updatedAt:String
}
type Series{
    name:String
    data:[Int]
}

input Filter{
    dateBy:String
    item:String
}   
type Query{
    orders(id:[ID],deleted:Boolean,search:String):[Order]
    # orderSelection(id:[ID!]):[Order]
    expenses(id:[ID],deleted:Boolean,search:String):[Expense]
    # expenseSelection(id:[ID!]):[Expense]
    products(id:[ID],deleted:Boolean,search:String):[Product]
    userValidation(token:String):User
    # productSelection(id:[ID!]):[Product]
    chartData(filter:Filter):[Series]

} 

type Mutation{
    addProduct(product:ProductValue!):Product
    updateProduct(product:ProductValue!):Product
    deleteProduct(id:[ID!]):[Product]
    addOrder(order:OrderValue!):Order
    updateOrder(order:OrderValue!):Order
    deleteOrder(id:[ID!]):[Order]
    addExpense(expense:ExpenseValue!):Expense
    updateExpense(expense:ExpenseValue!):Expense
    deleteExpense(id:[ID!]):[Expense]
    registerUser(user:UserRegisterValue!):String
    loginUser(user:UserLoginValue!):String

}

input ExpenseValue{
    id:ID  
    expenseType:String
    amount:PriceValue
    cashInBank:PriceValue
    cashInHand:PriceValue
    note:String
    operationType:String
    versionId:Int

}
input ProductValue {
    id:ID
    image:String
    distributorPrice:PriceValue
    sellerPrice:PriceValue
    size:[String]
    inStock: Boolean!
    name:String!
    versionId:Int

}
input OrderValue{
    id:ID
    customerName:String
    orderDate:String
    orderType:String
    amount:PriceValue
    location:AddressValue
    productId:ID!
    status:String
    paymentStatus:Boolean 
    deliveryDate:String
    versionId:Int


}
input AddressValue{
    address:String
    pincode:Int
    city:String
    state:String
    country:String
}
input UserLoginValue{
    email:String!
    password:String!
}

input UserRegisterValue{
    email:String!
    password:String!
    username:String
}

input PriceValue{
    currency:String
    amount:Int
}
`;

export { GraphqlSchema };
