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
    'Collect detailed information about the user based on the specified categories. Provide results in subject-verb-object sentence form.',
  parameters: {
    type: 'object',
    properties: {
      personal_info: {
        type: 'object',
        properties: {
          age: { type: 'integer', description: "User's age" },
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
            description: 'Key relationships like friends or partners',
          },
        },
      },
      likes: {
        type: 'object',
        properties: {
          people: { type: 'array', items: { type: 'string' } },
          celebrities: { type: 'array', items: { type: 'string' } },
          colors: { type: 'array', items: { type: 'string' } },
          places: { type: 'array', items: { type: 'string' } },
          foods: { type: 'array', items: { type: 'string' } },
          activities: { type: 'array', items: { type: 'string' } },
          hobbies: { type: 'array', items: { type: 'string' } },
        },
      },
      dislikes: {
        type: 'object',
        properties: {
          foods: { type: 'array', items: { type: 'string' } },
          people: { type: 'array', items: { type: 'string' } },
          behaviors: { type: 'array', items: { type: 'string' } },
          celebrities: { type: 'array', items: { type: 'string' } },
        },
      },
      recent_updates: {
        type: 'object',
        properties: {
          interests: { type: 'array', items: { type: 'string' } },
          concerns: { type: 'array', items: { type: 'string' } },
          daily_life: { type: 'string' },
          relationship_updates: { type: 'string' },
          future_plans: { type: 'string' },
          anxieties: { type: 'string' },
          goals: { type: 'string' },
        },
      },
      activities: {
        type: 'object',
        properties: {
          past: {
            type: 'array',
            items: { type: 'string' },
            description: 'Past activities user has done',
          },
          current: {
            type: 'array',
            items: { type: 'string' },
            description: 'Current activities the user is engaged in',
          },
          future: {
            type: 'array',
            items: { type: 'string' },
            description: 'Activities user wants to do in the future',
          },
        },
      },
    },
  },
};

// export const saveUserProfileTools = {
//   name: 'saveUserProfile',
//   description:
//     'Saves all relevant user profile data, preferences, and conversation facts to the database',
//   parameters: {
//     type: 'object',
//     properties: {
//       userId: {
//         type: 'string',
//         description: 'The unique ID of the user',
//       },
//       name: {
//         type: 'string',
//         description: 'The name of the user',
//       },
//       age: {
//         type: 'integer',
//         description: "The user's age",
//       },
//       location: {
//         type: 'string',
//         description: "The user's location, city or country",
//       },
//       preferences: {
//         type: 'object',
//         description: "The user's preferences",
//         properties: {
//           favorite_color: {
//             type: 'string',
//             description: "The user's favorite color",
//           },
//           favorite_food: {
//             type: 'string',
//             description: "The user's favorite food",
//           },
//           preferred_language: {
//             type: 'string',
//             description: "The user's preferred language",
//           },
//           hobbies: {
//             type: 'array',
//             items: {
//               type: 'string',
//             },
//             description: "The user's hobbies or interests",
//           },
//         },
//       },
//       recent_activities: {
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//         description: 'Recent actions the user has taken or mentioned',
//       },
//       device_info: {
//         type: 'object',
//         description: "Information about the user's device",
//         properties: {
//           device_type: {
//             type: 'string',
//             description:
//               'The type of device the user is using (e.g., mobile, desktop)',
//           },
//           os: {
//             type: 'string',
//             description: "The operating system of the user's device",
//           },
//         },
//       },
//       conversation_context: {
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//         description: 'Relevant facts gathered during the conversation',
//       },
//     },
//     // required: ['userId', 'name'],
//   },
// };

// export const saveUserProfileTools = {
//   name: 'saveUserProfile',
//   description:
//     'Saves user profile data, preferences, and conversation facts into the database. This includes user device information, recent activities, and more.',
//   parameters: {
//     type: 'object',
//     properties: {
//       userId: {
//         type: 'string',
//         description: 'The unique ID of the user. This is a required field.',
//       },
//       name: {
//         type: 'string',
//         description: 'The name of the user. This is a required field.',
//       },
//       age: {
//         type: 'integer',
//         description: "The user's age (optional).",
//         minimum: 0, // Ensure age is a non-negative value
//       },
//       location: {
//         type: 'string',
//         description:
//           "The user's location (optional). Could be city, country, etc.",
//       },
//       preferences: {
//         type: 'object',
//         description: "The user's preferences, such as favorite things.",
//         properties: {
//           favorite_color: {
//             type: 'string',
//             description: "The user's favorite color.",
//           },
//           favorite_food: {
//             type: 'string',
//             description: "The user's favorite food.",
//           },
//           preferred_language: {
//             type: 'string',
//             description: "The user's preferred language for communication.",
//           },
//           hobbies: {
//             type: 'array',
//             items: {
//               type: 'string',
//             },
//             description: "The user's hobbies or interests (optional).",
//           },
//         },
//       },
//       recent_activities: {
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//         description:
//           'A list of recent actions or activities the user has taken (optional).',
//       },
//       device_info: {
//         type: 'object',
//         description: "Information about the user's device (optional).",
//         properties: {
//           device_type: {
//             type: 'string',
//             description: 'The type of device (e.g., mobile, desktop, tablet).',
//           },
//           os: {
//             type: 'string',
//             description:
//               "The operating system running on the user's device (e.g., iOS, Android, Windows).",
//           },
//           browser: {
//             type: 'string',
//             description: 'The browser used by the user (e.g., Chrome, Safari).',
//           },
//           screen_resolution: {
//             type: 'string',
//             description: "The user's screen resolution (e.g., 1920x1080).",
//           },
//         },
//       },
//       conversation_context: {
//         type: 'array',
//         items: {
//           type: 'string',
//         },
//         description:
//           'Relevant facts and contexts gathered from the current conversation.',
//       },
//     },
//     required: ['userId', 'name'], // Making userId and name required
//   },
// };
export function saveUserProfile(params) {
  console.log(params);
  return JSON.stringify(params);
}
