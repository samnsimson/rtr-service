import { ApolloDriverConfig } from '@nestjs/apollo';

export const graphqlValidationConfig: Partial<ApolloDriverConfig> = {
  formatError: (error) => {
    const { extensions } = error;
    if (extensions?.code === 'GRAPHQL_VALIDATION_FAILED') {
      return {
        message: error.message,
        extensions: { ...extensions, code: 'VALIDATION_ERROR' },
        validationErrors: extensions.validationErrors || [],
      };
    }

    return {
      message: error.message,
      extensions: { ...extensions, code: extensions?.code || 'INTERNAL_SERVER_ERROR' },
    };
  },

  validationRules: [
    // Add custom validation rules if needed
  ],

  plugins: [
    // Add plugins for better error handling if needed
  ],
};
