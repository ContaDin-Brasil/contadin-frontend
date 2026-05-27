import '@testing-library/jest-native/extend-expect';

process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:8080';
process.env.EXPO_PUBLIC_PYTHON_BASE_URL = 'http://localhost:8000';

jest.mock(
	'react-native/Libraries/Animated/NativeAnimatedHelper',
	() => ({}),
	{ virtual: true },
);
