import Product from "../models/ProductModel.js";
import Order from "../models/Order.js";

import { StatusCodes } from "http-status-codes";
import { checkPermissions } from "../utils/index.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderID } = req.params;
  const order = await Order.findOne({ _id: orderID });
  if (!order) {
    throw new NotFoundError(`No Order with id ${orderID}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const order = await Order.find({ user: req.user.userId });
  if (!order) {
    throw new BadRequestError(
      `no orders belonging to user with id ${req.user.userId}`
    );
  }

  res.status(StatusCodes.OK).json({ order });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No Cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("please provide tax and shipping fee");
  }
  //Now, we have to test whether the product exists using the Product Model.
  //So because the testing is using await,We cannot use For Each or map fxn on the array, we'll have to use For Of loop.

  //first we set two variable

  let orderItems = [];
  let subtotal = 0; //will be the price * quantity for every product.

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No item with id ${item.product} found!`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    //add item to orderItems
    orderItems = [...orderItems, singleOrderItem];
    //calculate subTotal
    subtotal += item.amount * price;
  }
  //calc total
  const total = tax + shippingFee + subtotal;
  //get client secret. note I'm not involving the actual stripe library i will set up a fake function instead.
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new NotFoundError(`No order found with id ${id}`);
  }

  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();

  res.status(StatusCodes.OK).json({ order, msg: "updated successfully!" });
};

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
