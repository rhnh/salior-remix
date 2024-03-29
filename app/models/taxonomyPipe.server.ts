// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const paginationPipeLine = (pageNumber = 1, limit = 5) => {
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
        rank: "species",
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
        birds: [
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
        birds: {
          $slice: [
            "$birds",
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
        totalBirds: "$total.count",
      },
    },
  ];
};
export const unApprovedPipe2 =
  [
    {
      '$match': {
        '$or': [
          {
            'role': 'admin'
          }, {
            'role': 'mod'
          }
          , {
            'role': 'contributor'
          }
        ]
      }
    }, {
      '$lookup': {
        'from': 'Taxonomy',
        'let': {
          'username': '$username'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$username', '$$username'
                    ]
                  }, {
                    '$eq': [
                      {
                        '$getField': 'isApproved'
                      }, false
                    ]
                  }
                ]
              }
            }
          }
        ],
        'as': 'birds'
      }
    }, {
      '$project': {
        'birds': 1,
        '_id': 0
      }
    }, {
      '$unwind': {
        'path': '$birds'
      }
    }
  ]
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
                role: "contributor",
              },
              {
                role: "mod",
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

export const randomBirdPipe = [
  {
    '$match': {
      isApproved: true,
      rank: "species",
      info: { $exists: true, $ne: null, },
      imageUrl: { $exists: true, $ne: "imageUrl" }
    }
  }, {
    '$sample': {
      'size': 1
    }
  }
]