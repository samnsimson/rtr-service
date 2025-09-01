import { ApolloDriverConfig } from '@nestjs/apollo';

export const graphqlValidationConfig: Partial<ApolloDriverConfig> = {
  formatError: (error) => {
    // Extract validation errors from GraphQL extensions
    const { extensions } = error;

    if (extensions?.code === 'GRAPHQL_VALIDATION_FAILED') {
      return {
        message: error.message,
        extensions: {
          ...extensions,
          code: 'VALIDATION_ERROR',
        },
        // Format validation errors for GraphQL clients
        validationErrors: extensions.validationErrors || [],
      };
    }

    // Handle other GraphQL errors
    return {
      message: error.message,
      extensions: {
        ...extensions,
        code: extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    };
  },

  // Enable GraphQL validation
  validationRules: [
    // Add custom validation rules if needed
  ],

  // Error handling
  plugins: [
    // Add plugins for better error handling if needed
  ],
};
