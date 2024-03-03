export const GraphqlSchema = `#graphql

type Price{
    currency:String
    amount:Float
}
type  ProductSchema{
    id:ID!
    productSchemaId:Int
    name: String
    versionId:Int
    distributorPrice:Price!
    sellerPrice:Price!
    size:[String]
    inStock: Boolean
    createdAt:String!
    updatedAt:String!
    
}
type  Product{
    id:ID!
    productId:Int
    name: String
    image:String
    versionId:Int
    price:Price!
    productSchemaId:String
    productSchema:ProductSchema
    size:String
    quantity:Int
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
    value:String
}

input Filter{
    dateBy:String
    item:String
    group:String
    id:[String] 
    queryPath:String
    dynamicQuery:String # stringfyied JSON {and:[{},{}], or:[{},{}]}
}   

input ListFilter{
    id:[String] 
    deleted:Int 
    search:String 
    dateBy:String
    limit:Int
    dynamicQuery:String # stringfyied JSON {and:[{},{}], or:[{},{}]}

}
union VersionItem = Product | Expense | Order

type VersionedItem{
    versions:[VersionItem]
}
type Query{
    orders(filter:ListFilter):[Order]
    # orderSelection(id:[ID!]):[Order]
    expenses(filter:ListFilter):[Expense]
    productSchemas(filter:ListFilter):[ProductSchema]

    # expenseSelection(id:[ID!]):[Expense]
    products(filter:ListFilter):[Product]
    userValidation(token:String):User
    # productSelection(id:[ID!]):[Product]
    chartData(filter:Filter):[Series]
    getVersionItem(id:ID,all:Boolean):VersionedItem

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
    loginWithGoogle(credentials:String!):String
    addProductSchema(productSchema:ProductSchemaValue!):ProductSchema
    updateProductSchema(productSchema:ProductSchemaValue!):ProductSchema
    deleteProductSchema(id:[ID!]):[ProductSchema]

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
input ProductSchemaValue {
    id:ID
    image:String
    distributorPrice:PriceValue
    sellerPrice:PriceValue
    size:[String]
    inStock: Boolean!
    name:String!
    versionId:Int

}
input ProductValue {
    id:ID
    image:String
    price:PriceValue
    productSchemaId:String!
    size:String
    inStock: Boolean!
    name:String!
    versionId:Int
    quantity:Int

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
