export interface UserProfileParams {
  userId?: string; // optional
  name?: string; // optional
  age?: number;
  location?: string;
  preferences?: {
    favorite_color?: string;
    favorite_food?: string;
    preferred_language?: string;
    hobbies?: string[];
  };
  recent_activities?: string[];
  device_info?: {
    device_type?: string;
    os?: string;
  };
  conversation_context?: string[];
}
// export const saveUserProfileTools = {
//   name: 'saveUserProfile',
//   description:
//     'Saves user profile data, preferences, and other relevant facts in full sentence form to the database.',
//   parameters: {
//     type: 'object',
//     properties: {
//       userId: {
//         type: 'string',
//         description: 'The unique ID of the user',
//       },
//       name: {
//         type: 'string',
//         description: 'The name of the user (full sentence)',
//       },
//       age: {
//         type: 'integer',
//         description: "The user's age (full sentence)",
//       },
//       preferences: {
//         type: 'object',
//         description: "The user's preferences (favorite things, likes)",
//         properties: {
//           favorite_color: {
//             type: 'string',
//             description: "The user's favorite color (full sentence)",
//           },
//           favorite_food: {
//             type: 'string',
//             description: "The user's favorite food (full sentence)",
//           },
//           hobbies: {
//             type: 'array',
//             items: {
//               type: 'string',
//             },
//             description: "The user's hobbies or interests (full sentence)",
//           },
//         },
//       },
//       things_to_do: {
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//         description:
//           'Things the user wants to do or plans to do (full sentence)',
//       },
//       things_done: {
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//         description: 'Things the user has done (full sentence)',
//       },
//       things_to_do_later: {
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//         description: 'Tasks the user needs to complete later (full sentence)',
//       },
//     },
//     required: ['userId', 'name'],
//   },
// };
export const saveUserProfileTools = {
  name: 'saveUserProfile',
  description:
    'If information on personal details, likes, dislikes, recent updates, or activities is provided or referenced, this function must be executed to collect and format these details in Korean(-음/함). Ensure this function is called whenever user-specific data across these categories is available, as this function processes to support personalized user experience.',
  parameters: {
    type: 'object',
    properties: {
      personal_info: {
        type: 'object',
        properties: {
          age: { type: 'integer', description: "User's age." },
          gender: { type: 'string', description: "User's gender" },
          job: { type: 'string', description: "User's occupation" },
          personality: {
            type: 'string',
            description: "User's personality traits",
          },
          living_arrangement: {
            type: 'string',
            description: "User's living arrangement",
          },
          family_relationship: {
            type: 'string',
            description: 'Brief info on family relations',
          },
          interpersonal_relationships: {
            type: 'array',
            items: { type: 'string' },
            description:
              "User's key interpersonal relationships, such as friends or partners.",
          },
        },
      },
      likes: {
        type: 'object',
        description: "User's preferences and favorite things.",
        properties: {
          people: {
            type: 'array',
            items: { type: 'string' },
            description: 'People the user likes or admires.',
          },
          celebrities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Celebrities the user likes or follows.',
          },
          colors: {
            type: 'array',
            items: { type: 'string' },
            description: "User's favorite colors.",
          },
          places: {
            type: 'array',
            items: { type: 'string' },
            description: 'Places the user enjoys visiting or wishes to visit.',
          },
          foods: {
            type: 'array',
            items: { type: 'string' },
            description: "User's favorite foods.",
          },
          activities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Activities the user enjoys.',
          },
          hobbies: {
            type: 'array',
            items: { type: 'string' },
            description: "User's hobbies and interests.",
          },
        },
      },
      dislikes: {
        type: 'object',
        description: 'Things the user dislikes or avoids.',
        properties: {
          foods: {
            type: 'array',
            items: { type: 'string' },
            description: 'Foods the user dislikes.',
          },
          people: {
            type: 'array',
            items: { type: 'string' },
            description: 'People the user prefers to avoid.',
          },
          behaviors: {
            type: 'array',
            items: { type: 'string' },
            description: 'Behaviors or actions the user dislikes.',
          },
          celebrities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Celebrities the user dislikes or finds annoying.',
          },
        },
      },
      recent_updates: {
        type: 'object',
        description: "User's recent updates and thoughts.",
        properties: {
          interests: {
            type: 'array',
            items: { type: 'string' },
            description: "User's current interests or new areas of focus.",
          },
          concerns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Current issues or topics of concern for the user.',
          },
          daily_life: {
            type: 'string',
            description: "User's day-to-day life and routines.",
          },
          relationship_updates: {
            type: 'string',
            description: "Updates on user's relationships.",
          },
          future_plans: {
            type: 'string',
            description: "User's plans for the near future.",
          },
          anxieties: {
            type: 'string',
            description: 'Concerns or anxieties currently affecting the user.',
          },
          goals: {
            type: 'string',
            description: "User's short- or long-term goals.",
          },
        },
      },
      activities: {
        type: 'object',
        description: "User's past, current, and future activities.",
        properties: {
          past: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Activities the user has completed or participated in.',
          },
          current: {
            type: 'array',
            items: { type: 'string' },
            description: 'Ongoing activities the user is currently engaged in.',
          },
          future: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Activities the user plans or hopes to do in the future.',
          },
        },
      },
    },
  },
};

// export const saveUserProfileTools = {
//   name: 'saveUserProfile',
//   description:
//     'If information on personal details, likes, dislikes, recent updates, or activities is provided or referenced, this function must be executed to collect and format these details as individual sentences in Korean. Ensure this function is called whenever user-specific data across these categories is available, as this function processes and organizes each item into clear, standalone statements to support personalized user experience..',
//   parameters: {
//     type: 'object',
//     properties: {
//       personal_info: {
//         type: 'object',
//         properties: {
//           age: {
//             type: 'string',
//             description: "User's age as a sentence",
//             example: '나이는 30세임',
//           },
//           gender: {
//             type: 'string',
//             description: "User's gender as a sentence",
//             example: '성별은 남성임',
//           },
//           job: {
//             type: 'string',
//             description: "User's job as a sentence",
//             example: '직업은 개발자임',
//           },
//           personality: {
//             type: 'string',
//             description: "User's personality as a sentence",
//             example: '성격이 활발함',
//           },
//           living_arrangement: {
//             type: 'string',
//             description: "User's living arrangement as a sentence",
//             example: ['혼자 살고 있음, 서울에 살고 있음'],
//           },
//           family_relationship: {
//             type: 'string',
//             description: 'User’s family relationship as a sentence',
//             example: ['가족 중 오빠가 있음', '가족 관계가 좋음'],
//           },
//           interpersonal_relationships: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Key relationships, each as an individual sentence',
//             example: ['친구와 자주 만남', '남자친구가 있음'],
//           },
//         },
//       },
//       likes: {
//         type: 'object',
//         properties: {
//           people: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Liked people, each as a sentence',
//             example: ['친구와 잘 지냄'],
//           },
//           celebrities: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Liked celebrities, each as a sentence',
//             example: ['아이유를 좋아함'],
//           },
//           colors: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Favorite colors, each as a sentence',
//             example: ['파란색을 선호함'],
//           },
//           places: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Favorite places, each as a sentence',
//             example: ['해변을 좋아함'],
//           },
//           foods: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Favorite foods, each as a sentence',
//             example: ['파스타를 좋아함'],
//           },
//           activities: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Favorite activities, each as a sentence',
//             example: ['수영을 좋아함'],
//           },
//           hobbies: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Favorite hobbies, each as a sentence',
//             example: ['요리를 취미로 삼음'],
//           },
//         },
//       },
//       dislikes: {
//         type: 'object',
//         properties: {
//           foods: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Disliked foods, each as a sentence',
//             example: ['매운 음식을 싫어함'],
//           },
//           people: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Disliked people, each as a sentence',
//             example: ['불친절한 사람을 싫어함'],
//           },
//           behaviors: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Disliked behaviors, each as a sentence',
//             example: ['지각하는 것을 싫어함'],
//           },
//           celebrities: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Disliked celebrities, each as a sentence',
//             example: ['유명인을 별로 좋아하지 않음'],
//           },
//         },
//       },
//       recent_updates: {
//         type: 'object',
//         properties: {
//           interests: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Recent interests, each as a sentence',
//             example: ['사진 촬영에 관심이 생김'],
//           },
//           concerns: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Recent concerns, each as a sentence',
//             example: ['건강에 대해 걱정이 있음'],
//           },
//           daily_life: {
//             type: 'string',
//             description: 'Daily life as a sentence',
//             example: '최근에는 바쁜 일상을 보내고 있음',
//           },
//           relationship_updates: {
//             type: 'string',
//             description: 'Relationship updates as a sentence',
//             example: '친구들과 관계가 더욱 가까워짐',
//           },
//           future_plans: {
//             type: 'string',
//             description: 'Future plans as a sentence',
//             example: '해외 여행을 계획 중임',
//           },
//           anxieties: {
//             type: 'string',
//             description: 'Current anxieties as a sentence',
//             example: '직장 문제로 걱정이 있음',
//           },
//           goals: {
//             type: 'string',
//             description: 'Current goals as a sentence',
//             example: '올해 안에 책을 쓰는 것이 목표임',
//           },
//         },
//       },
//       activities: {
//         type: 'object',
//         properties: {
//           past: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Past activities, each stored as a sentence',
//             example: ['요가를 함', '독서를 즐기곤 함'],
//           },
//           current: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Current activities, each stored as a sentence',
//             example: ['헬스를 하고 있음', '프로그래밍을 배우고 있음'],
//           },
//           future: {
//             type: 'array',
//             items: { type: 'string' },
//             description: 'Future planned activities, each stored as a sentence',
//             example: ['등산을 할 계획임', '여행을 갈 예정임'],
//           },
//         },
//       },
//     },
//   },
// };
export function saveUserProfile(params) {
  console.log(params);
  return JSON.stringify(params);
}
