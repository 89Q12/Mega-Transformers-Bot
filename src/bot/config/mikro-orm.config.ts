import { Options } from '@mikro-orm/core';
import {
	BanImages,
	Channelcleans,
	Experiences,
	Guilds,
	MentionResponses,
} from '../entities';
const config: Options = {
	type: 'sqlite',
	// as we are using class references here, we don't need to specify `entitiesTs` option
	entities: [BanImages, Channelcleans, Experiences, Guilds, MentionResponses],
	debug: false,
};

export default config;
