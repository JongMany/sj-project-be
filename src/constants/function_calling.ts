export const saveUserProfileFunction = {
  name: 'save_user_profile',
  description:
    'Saves all relevant user profile data, preferences, and conversation facts to the database',
  parameters: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'The unique ID of the user',
      },
      name: {
        type: 'string',
        description: 'The name of the user',
      },
      age: {
        type: 'integer',
        description: "The user's age",
      },
      location: {
        type: 'string',
        description: "The user's location, city or country",
      },
      preferences: {
        type: 'object',
        description: "The user's preferences",
        properties: {
          favorite_color: {
            type: 'string',
            description: "The user's favorite color",
          },
          favorite_food: {
            type: 'string',
            description: "The user's favorite food",
          },
          preferred_language: {
            type: 'string',
            description: "The user's preferred language",
          },
          hobbies: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: "The user's hobbies or interests",
          },
        },
      },
      recent_activities: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Recent actions the user has taken or mentioned',
      },
      device_info: {
        type: 'object',
        description: "Information about the user's device",
        properties: {
          device_type: {
            type: 'string',
            description:
              'The type of device the user is using (e.g., mobile, desktop)',
          },
          os: {
            type: 'string',
            description: "The operating system of the user's device",
          },
        },
      },
      conversation_context: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Relevant facts gathered during the conversation',
      },
    },
    required: ['userId', 'name'],
  },
};
