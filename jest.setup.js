import '@testing-library/jest-native/extend-expect';

process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:8080';
process.env.EXPO_PUBLIC_PYTHON_BASE_URL = 'http://localhost:8000';

jest.mock(
	'react-native/Libraries/Animated/NativeAnimatedHelper',
	() => ({}),
	{ virtual: true },
);

// Node.js 22+ e 24 expõem ReadableStream globalmente. O Axios 1.x usa isso para
// testar o adapter fetch ao carregar, mas a polyfill do Expo não é compatível com
// esse teste, derrubando o processo. Removemos o global para que o Axios ignore o
// adapter fetch e use o adapter http nativo — sem efeito nos testes que mocam APIs.
global.ReadableStream = undefined;