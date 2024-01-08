import { expect, test } from '@playwright/test';
import { BaseRepository } from '../../js/baserepository.js';

test('See if we can test in process', async () => {
	const br = new BaseRepository(sillyConverter,'foo');
});