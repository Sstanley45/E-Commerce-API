[
  {
    $match: {
      product: new ObjectId("64f0e78c7c830f7d023756bf"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
