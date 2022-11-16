// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const paginationPipeLine = (pageNumber = 1) => {
  const limit = 5;
  const cal = (Number(pageNumber) - 1) * limit;
  const skip = cal < 0 ? 0 : cal;
  if (pageNumber <= 0) {
    pageNumber = 1;
  }

  return [
    {
      $match: {
        isApproved: true,
        englishName: { $ne: null },
        rank: /species/i,
      },
    },
    {
      $project: {
        ancestors: 0,
        parent: 0,
      },
    },

    {
      $sort: {
        taxonomyName: -1,
      },
    },

    {
      $facet: {
        total: [
          {
            $count: "count",
          },
        ],
        items: [
          {
            $addFields: {
              _id: "$_id",
            },
          },
        ],
      },
    },

    {
      $unwind: "$total",
    },

    {
      $project: {
        items: {
          $slice: [
            "$items",
            skip,
            {
              $ifNull: [limit, "$total.count"],
            },
          ],
        },
        page: {
          $literal: skip / limit + 1,
        },
        hasNextPage: {
          $lt: [{ $multiply: [limit, Number(pageNumber)] }, "$total.count"],
        },
        hasPreviousPage: {
          $cond: [
            { $eq: [Number(pageNumber), 1] }, //if current pageName is equal to the fist, then return false
            false,
            { $gt: [Number(pageNumber), Number(pageNumber) - 1] }, //else return current pageNumber is greater than previous page.
          ],
        },
        totalPages: {
          $ceil: {
            $divide: ["$total.count", limit],
          },
        },
        totalItems: "$total.count",
      },
    },
  ];
};
export const unApprovedPipe = [
  {
    $match: {
      isApproved: false,
    },
  },
  {
    $lookup: {
      from: "users",
      pipeline: [
        {
          $match: {
            $or: [
              {
                role: "admin",
              },
              {
                role: "con",
              },
            ],
          },
        },
        {
          $project: {
            role: 1,
            _id: 0,
          },
        },
      ],
      as: "users",
    },
  },
  {
    $unwind: {
      path: "$users",
    },
  },
  {
    $addFields: {
      role: "$users.role",
    },
  },
  {
    $project: {
      users: 0,
    },
  },
];

export const ancestorsPipeLine = ({
  p,
  r,
}: {
  p: RegExp;
  r: RegExp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any[] => [
  {
    $match: {
      ancestors: p,
      rank: r,
      isApproved: true,
    },
  },
  {
    $project: {
      ancestors: 1,
      _id: 0,
    },
  },
  {
    $limit: 1,
  },
];

export const getByUserPipeLine = ({
  username,
  listName,
}: {
  username: string;
  listName: string;
}): any[] => [
  {
    $match: {
      listName,
      username,
    },
  },
  {
    $lookup: {
      from: "taxonomies",
      localField: "birds.birdId",
      foreignField: "_id",
      as: "string",
    },
  },
];
