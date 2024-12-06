'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">mega-transformers-bot documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-f6db38b079eaebcd93e2781b422ca653db4b0cdce1053246a7fa7e891d90012a00ac87bffaa500c20c9f57e81b10525ca9198bbb2ec124652da5cc083ef31f47"' : 'data-bs-target="#xs-controllers-links-module-AppModule-f6db38b079eaebcd93e2781b422ca653db4b0cdce1053246a7fa7e891d90012a00ac87bffaa500c20c9f57e81b10525ca9198bbb2ec124652da5cc083ef31f47"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-f6db38b079eaebcd93e2781b422ca653db4b0cdce1053246a7fa7e891d90012a00ac87bffaa500c20c9f57e81b10525ca9198bbb2ec124652da5cc083ef31f47"' :
                                            'id="xs-controllers-links-module-AppModule-f6db38b079eaebcd93e2781b422ca653db4b0cdce1053246a7fa7e891d90012a00ac87bffaa500c20c9f57e81b10525ca9198bbb2ec124652da5cc083ef31f47"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-f6db38b079eaebcd93e2781b422ca653db4b0cdce1053246a7fa7e891d90012a00ac87bffaa500c20c9f57e81b10525ca9198bbb2ec124652da5cc083ef31f47"' : 'data-bs-target="#xs-injectables-links-module-AppModule-f6db38b079eaebcd93e2781b422ca653db4b0cdce1053246a7fa7e891d90012a00ac87bffaa500c20c9f57e81b10525ca9198bbb2ec124652da5cc083ef31f47"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-f6db38b079eaebcd93e2781b422ca653db4b0cdce1053246a7fa7e891d90012a00ac87bffaa500c20c9f57e81b10525ca9198bbb2ec124652da5cc083ef31f47"' :
                                        'id="xs-injectables-links-module-AppModule-f6db38b079eaebcd93e2781b422ca653db4b0cdce1053246a7fa7e891d90012a00ac87bffaa500c20c9f57e81b10525ca9198bbb2ec124652da5cc083ef31f47"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuditLogModule.html" data-type="entity-link" >AuditLogModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuditLogModule-77e8df9ce183c0542968b4ce842018c551e014ce873957a66043cf03a89f88f268a07ce7c428cda363a74a6df44e67d2e28345b4fa0f00c0a794aedda89a1aa3"' : 'data-bs-target="#xs-controllers-links-module-AuditLogModule-77e8df9ce183c0542968b4ce842018c551e014ce873957a66043cf03a89f88f268a07ce7c428cda363a74a6df44e67d2e28345b4fa0f00c0a794aedda89a1aa3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuditLogModule-77e8df9ce183c0542968b4ce842018c551e014ce873957a66043cf03a89f88f268a07ce7c428cda363a74a6df44e67d2e28345b4fa0f00c0a794aedda89a1aa3"' :
                                            'id="xs-controllers-links-module-AuditLogModule-77e8df9ce183c0542968b4ce842018c551e014ce873957a66043cf03a89f88f268a07ce7c428cda363a74a6df44e67d2e28345b4fa0f00c0a794aedda89a1aa3"' }>
                                            <li class="link">
                                                <a href="controllers/AuditLogController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditLogController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuditLogModule-77e8df9ce183c0542968b4ce842018c551e014ce873957a66043cf03a89f88f268a07ce7c428cda363a74a6df44e67d2e28345b4fa0f00c0a794aedda89a1aa3"' : 'data-bs-target="#xs-injectables-links-module-AuditLogModule-77e8df9ce183c0542968b4ce842018c551e014ce873957a66043cf03a89f88f268a07ce7c428cda363a74a6df44e67d2e28345b4fa0f00c0a794aedda89a1aa3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuditLogModule-77e8df9ce183c0542968b4ce842018c551e014ce873957a66043cf03a89f88f268a07ce7c428cda363a74a6df44e67d2e28345b4fa0f00c0a794aedda89a1aa3"' :
                                        'id="xs-injectables-links-module-AuditLogModule-77e8df9ce183c0542968b4ce842018c551e014ce873957a66043cf03a89f88f268a07ce7c428cda363a74a6df44e67d2e28345b4fa0f00c0a794aedda89a1aa3"' }>
                                        <li class="link">
                                            <a href="injectables/AuditEvents.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditEvents</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuditLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditLogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BotModule.html" data-type="entity-link" >BotModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BotModule-716244f8a36d8ce87955bd5b896b9a01b28d8648c62201c72450bcc91ef379e130cc9200702f694ad64f20fb1835b20e45a04ae1395b0d97c7c2f15120ed2852"' : 'data-bs-target="#xs-injectables-links-module-BotModule-716244f8a36d8ce87955bd5b896b9a01b28d8648c62201c72450bcc91ef379e130cc9200702f694ad64f20fb1835b20e45a04ae1395b0d97c7c2f15120ed2852"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BotModule-716244f8a36d8ce87955bd5b896b9a01b28d8648c62201c72450bcc91ef379e130cc9200702f694ad64f20fb1835b20e45a04ae1395b0d97c7c2f15120ed2852"' :
                                        'id="xs-injectables-links-module-BotModule-716244f8a36d8ce87955bd5b896b9a01b28d8648c62201c72450bcc91ef379e130cc9200702f694ad64f20fb1835b20e45a04ae1395b0d97c7c2f15120ed2852"' }>
                                        <li class="link">
                                            <a href="injectables/GuildRestrictedChannelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildRestrictedChannelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildSettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildSettingsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GuildAutoDeleteChannelModule.html" data-type="entity-link" >GuildAutoDeleteChannelModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GuildAutoDeleteChannelModule-19670af785aed288f056244f5052b21b37bdb117a43cd5d33a850673322824e4f991c6760e9943f88e10e930118ce858933d3b0775b9e4b3a9fde904ad04a949"' : 'data-bs-target="#xs-controllers-links-module-GuildAutoDeleteChannelModule-19670af785aed288f056244f5052b21b37bdb117a43cd5d33a850673322824e4f991c6760e9943f88e10e930118ce858933d3b0775b9e4b3a9fde904ad04a949"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GuildAutoDeleteChannelModule-19670af785aed288f056244f5052b21b37bdb117a43cd5d33a850673322824e4f991c6760e9943f88e10e930118ce858933d3b0775b9e4b3a9fde904ad04a949"' :
                                            'id="xs-controllers-links-module-GuildAutoDeleteChannelModule-19670af785aed288f056244f5052b21b37bdb117a43cd5d33a850673322824e4f991c6760e9943f88e10e930118ce858933d3b0775b9e4b3a9fde904ad04a949"' }>
                                            <li class="link">
                                                <a href="controllers/GuildAutoDeleteChannelController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildAutoDeleteChannelController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GuildAutoDeleteChannelModule-19670af785aed288f056244f5052b21b37bdb117a43cd5d33a850673322824e4f991c6760e9943f88e10e930118ce858933d3b0775b9e4b3a9fde904ad04a949"' : 'data-bs-target="#xs-injectables-links-module-GuildAutoDeleteChannelModule-19670af785aed288f056244f5052b21b37bdb117a43cd5d33a850673322824e4f991c6760e9943f88e10e930118ce858933d3b0775b9e4b3a9fde904ad04a949"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GuildAutoDeleteChannelModule-19670af785aed288f056244f5052b21b37bdb117a43cd5d33a850673322824e4f991c6760e9943f88e10e930118ce858933d3b0775b9e4b3a9fde904ad04a949"' :
                                        'id="xs-injectables-links-module-GuildAutoDeleteChannelModule-19670af785aed288f056244f5052b21b37bdb117a43cd5d33a850673322824e4f991c6760e9943f88e10e930118ce858933d3b0775b9e4b3a9fde904ad04a949"' }>
                                        <li class="link">
                                            <a href="injectables/GuildAutoDeleteChannelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildAutoDeleteChannelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildRestrictedChannelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildRestrictedChannelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildSettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildSettingsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TasksService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GuildModule.html" data-type="entity-link" >GuildModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GuildModule-3385f014f006ef4b3d7c098552d6c1b52d07eb833a7df569c5a5deb33b14251eab0d0483f207c7a5ba2bf43576e93e3ebb90f2836aa90d895a21efda8f33e37b"' : 'data-bs-target="#xs-controllers-links-module-GuildModule-3385f014f006ef4b3d7c098552d6c1b52d07eb833a7df569c5a5deb33b14251eab0d0483f207c7a5ba2bf43576e93e3ebb90f2836aa90d895a21efda8f33e37b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GuildModule-3385f014f006ef4b3d7c098552d6c1b52d07eb833a7df569c5a5deb33b14251eab0d0483f207c7a5ba2bf43576e93e3ebb90f2836aa90d895a21efda8f33e37b"' :
                                            'id="xs-controllers-links-module-GuildModule-3385f014f006ef4b3d7c098552d6c1b52d07eb833a7df569c5a5deb33b14251eab0d0483f207c7a5ba2bf43576e93e3ebb90f2836aa90d895a21efda8f33e37b"' }>
                                            <li class="link">
                                                <a href="controllers/GuildController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GuildModule-3385f014f006ef4b3d7c098552d6c1b52d07eb833a7df569c5a5deb33b14251eab0d0483f207c7a5ba2bf43576e93e3ebb90f2836aa90d895a21efda8f33e37b"' : 'data-bs-target="#xs-injectables-links-module-GuildModule-3385f014f006ef4b3d7c098552d6c1b52d07eb833a7df569c5a5deb33b14251eab0d0483f207c7a5ba2bf43576e93e3ebb90f2836aa90d895a21efda8f33e37b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GuildModule-3385f014f006ef4b3d7c098552d6c1b52d07eb833a7df569c5a5deb33b14251eab0d0483f207c7a5ba2bf43576e93e3ebb90f2836aa90d895a21efda8f33e37b"' :
                                        'id="xs-injectables-links-module-GuildModule-3385f014f006ef4b3d7c098552d6c1b52d07eb833a7df569c5a5deb33b14251eab0d0483f207c7a5ba2bf43576e93e3ebb90f2836aa90d895a21efda8f33e37b"' }>
                                        <li class="link">
                                            <a href="injectables/DmMessageHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DmMessageHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildMemberEvents.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildMemberEvents</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildMessageHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildMessageHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildRestrictedChannelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildRestrictedChannelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ModRequestFlow.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModRequestFlow</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GuildRestrictedChannelModule.html" data-type="entity-link" >GuildRestrictedChannelModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GuildRestrictedChannelModule-1cb55ead32180b2642dbb3c41f3535d88af92faa79e33f8a63ce1223fed3ab4e98b9879fe440cad8cd9f86bc904bd79241c8070b405547975a12e1cdec00b63e"' : 'data-bs-target="#xs-controllers-links-module-GuildRestrictedChannelModule-1cb55ead32180b2642dbb3c41f3535d88af92faa79e33f8a63ce1223fed3ab4e98b9879fe440cad8cd9f86bc904bd79241c8070b405547975a12e1cdec00b63e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GuildRestrictedChannelModule-1cb55ead32180b2642dbb3c41f3535d88af92faa79e33f8a63ce1223fed3ab4e98b9879fe440cad8cd9f86bc904bd79241c8070b405547975a12e1cdec00b63e"' :
                                            'id="xs-controllers-links-module-GuildRestrictedChannelModule-1cb55ead32180b2642dbb3c41f3535d88af92faa79e33f8a63ce1223fed3ab4e98b9879fe440cad8cd9f86bc904bd79241c8070b405547975a12e1cdec00b63e"' }>
                                            <li class="link">
                                                <a href="controllers/GuildRestrictedChannelController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildRestrictedChannelController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GuildRestrictedChannelModule-1cb55ead32180b2642dbb3c41f3535d88af92faa79e33f8a63ce1223fed3ab4e98b9879fe440cad8cd9f86bc904bd79241c8070b405547975a12e1cdec00b63e"' : 'data-bs-target="#xs-injectables-links-module-GuildRestrictedChannelModule-1cb55ead32180b2642dbb3c41f3535d88af92faa79e33f8a63ce1223fed3ab4e98b9879fe440cad8cd9f86bc904bd79241c8070b405547975a12e1cdec00b63e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GuildRestrictedChannelModule-1cb55ead32180b2642dbb3c41f3535d88af92faa79e33f8a63ce1223fed3ab4e98b9879fe440cad8cd9f86bc904bd79241c8070b405547975a12e1cdec00b63e"' :
                                        'id="xs-injectables-links-module-GuildRestrictedChannelModule-1cb55ead32180b2642dbb3c41f3535d88af92faa79e33f8a63ce1223fed3ab4e98b9879fe440cad8cd9f86bc904bd79241c8070b405547975a12e1cdec00b63e"' }>
                                        <li class="link">
                                            <a href="injectables/GuildRestrictedChannelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildRestrictedChannelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GuildSettingsModule.html" data-type="entity-link" >GuildSettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GuildSettingsModule-58f1a1a1f416de16d93bca8b42d6535dc5af370ed7a53a117008ef60b1d66eb124148f1461877e285eb70845f22e320318e1334930f8efb55339e7bd03144cd8"' : 'data-bs-target="#xs-controllers-links-module-GuildSettingsModule-58f1a1a1f416de16d93bca8b42d6535dc5af370ed7a53a117008ef60b1d66eb124148f1461877e285eb70845f22e320318e1334930f8efb55339e7bd03144cd8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GuildSettingsModule-58f1a1a1f416de16d93bca8b42d6535dc5af370ed7a53a117008ef60b1d66eb124148f1461877e285eb70845f22e320318e1334930f8efb55339e7bd03144cd8"' :
                                            'id="xs-controllers-links-module-GuildSettingsModule-58f1a1a1f416de16d93bca8b42d6535dc5af370ed7a53a117008ef60b1d66eb124148f1461877e285eb70845f22e320318e1334930f8efb55339e7bd03144cd8"' }>
                                            <li class="link">
                                                <a href="controllers/GuildSettingsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildSettingsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GuildSettingsModule-58f1a1a1f416de16d93bca8b42d6535dc5af370ed7a53a117008ef60b1d66eb124148f1461877e285eb70845f22e320318e1334930f8efb55339e7bd03144cd8"' : 'data-bs-target="#xs-injectables-links-module-GuildSettingsModule-58f1a1a1f416de16d93bca8b42d6535dc5af370ed7a53a117008ef60b1d66eb124148f1461877e285eb70845f22e320318e1334930f8efb55339e7bd03144cd8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GuildSettingsModule-58f1a1a1f416de16d93bca8b42d6535dc5af370ed7a53a117008ef60b1d66eb124148f1461877e285eb70845f22e320318e1334930f8efb55339e7bd03144cd8"' :
                                        'id="xs-injectables-links-module-GuildSettingsModule-58f1a1a1f416de16d93bca8b42d6535dc5af370ed7a53a117008ef60b1d66eb124148f1461877e285eb70845f22e320318e1334930f8efb55339e7bd03144cd8"' }>
                                        <li class="link">
                                            <a href="injectables/GuildSettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildSettingsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GuildUserModule.html" data-type="entity-link" >GuildUserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GuildUserModule-4b771fe22d8faea244c62df8db60d43c0165e7ec6c4441b491f63759a234fdf241d621156626e6b2a11c35541e4ace0e5821935aa7cbfef2813f4e709c9c6db3"' : 'data-bs-target="#xs-controllers-links-module-GuildUserModule-4b771fe22d8faea244c62df8db60d43c0165e7ec6c4441b491f63759a234fdf241d621156626e6b2a11c35541e4ace0e5821935aa7cbfef2813f4e709c9c6db3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GuildUserModule-4b771fe22d8faea244c62df8db60d43c0165e7ec6c4441b491f63759a234fdf241d621156626e6b2a11c35541e4ace0e5821935aa7cbfef2813f4e709c9c6db3"' :
                                            'id="xs-controllers-links-module-GuildUserModule-4b771fe22d8faea244c62df8db60d43c0165e7ec6c4441b491f63759a234fdf241d621156626e6b2a11c35541e4ace0e5821935aa7cbfef2813f4e709c9c6db3"' }>
                                            <li class="link">
                                                <a href="controllers/GuildUserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildUserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GuildUserModule-4b771fe22d8faea244c62df8db60d43c0165e7ec6c4441b491f63759a234fdf241d621156626e6b2a11c35541e4ace0e5821935aa7cbfef2813f4e709c9c6db3"' : 'data-bs-target="#xs-injectables-links-module-GuildUserModule-4b771fe22d8faea244c62df8db60d43c0165e7ec6c4441b491f63759a234fdf241d621156626e6b2a11c35541e4ace0e5821935aa7cbfef2813f4e709c9c6db3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GuildUserModule-4b771fe22d8faea244c62df8db60d43c0165e7ec6c4441b491f63759a234fdf241d621156626e6b2a11c35541e4ace0e5821935aa7cbfef2813f4e709c9c6db3"' :
                                        'id="xs-injectables-links-module-GuildUserModule-4b771fe22d8faea244c62df8db60d43c0165e7ec6c4441b491f63759a234fdf241d621156626e6b2a11c35541e4ace0e5821935aa7cbfef2813f4e709c9c6db3"' }>
                                        <li class="link">
                                            <a href="injectables/GuildSettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildSettingsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/JwtAuthModule.html" data-type="entity-link" >JwtAuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-JwtAuthModule-8311b284c13b4ec305b7842d2cbabe3e4851b8b77229cd178bb0dfca592854db60d06fb8b715a29a12182199cbbb615122725575d161dd3df410fbd1763949b9"' : 'data-bs-target="#xs-controllers-links-module-JwtAuthModule-8311b284c13b4ec305b7842d2cbabe3e4851b8b77229cd178bb0dfca592854db60d06fb8b715a29a12182199cbbb615122725575d161dd3df410fbd1763949b9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-JwtAuthModule-8311b284c13b4ec305b7842d2cbabe3e4851b8b77229cd178bb0dfca592854db60d06fb8b715a29a12182199cbbb615122725575d161dd3df410fbd1763949b9"' :
                                            'id="xs-controllers-links-module-JwtAuthModule-8311b284c13b4ec305b7842d2cbabe3e4851b8b77229cd178bb0dfca592854db60d06fb8b715a29a12182199cbbb615122725575d161dd3df410fbd1763949b9"' }>
                                            <li class="link">
                                                <a href="controllers/JwtAuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtAuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-JwtAuthModule-8311b284c13b4ec305b7842d2cbabe3e4851b8b77229cd178bb0dfca592854db60d06fb8b715a29a12182199cbbb615122725575d161dd3df410fbd1763949b9"' : 'data-bs-target="#xs-injectables-links-module-JwtAuthModule-8311b284c13b4ec305b7842d2cbabe3e4851b8b77229cd178bb0dfca592854db60d06fb8b715a29a12182199cbbb615122725575d161dd3df410fbd1763949b9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-JwtAuthModule-8311b284c13b4ec305b7842d2cbabe3e4851b8b77229cd178bb0dfca592854db60d06fb8b715a29a12182199cbbb615122725575d161dd3df410fbd1763949b9"' :
                                        'id="xs-injectables-links-module-JwtAuthModule-8311b284c13b4ec305b7842d2cbabe3e4851b8b77229cd178bb0dfca592854db60d06fb8b715a29a12182199cbbb615122725575d161dd3df410fbd1763949b9"' }>
                                        <li class="link">
                                            <a href="injectables/JwtAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtAuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtAuthStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtAuthStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshJwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshJwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SelfService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelfService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ModerationModule.html" data-type="entity-link" >ModerationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ModerationModule-8a6778b635f6f4648523a6380d08f9e8900d446586cddbe368e2d07e7084681d806b6f744d69450980d139f7473065003fd62f6a9304ab570b82956a37a4d347"' : 'data-bs-target="#xs-controllers-links-module-ModerationModule-8a6778b635f6f4648523a6380d08f9e8900d446586cddbe368e2d07e7084681d806b6f744d69450980d139f7473065003fd62f6a9304ab570b82956a37a4d347"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ModerationModule-8a6778b635f6f4648523a6380d08f9e8900d446586cddbe368e2d07e7084681d806b6f744d69450980d139f7473065003fd62f6a9304ab570b82956a37a4d347"' :
                                            'id="xs-controllers-links-module-ModerationModule-8a6778b635f6f4648523a6380d08f9e8900d446586cddbe368e2d07e7084681d806b6f744d69450980d139f7473065003fd62f6a9304ab570b82956a37a4d347"' }>
                                            <li class="link">
                                                <a href="controllers/ChannelController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RoleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ModerationModule-8a6778b635f6f4648523a6380d08f9e8900d446586cddbe368e2d07e7084681d806b6f744d69450980d139f7473065003fd62f6a9304ab570b82956a37a4d347"' : 'data-bs-target="#xs-injectables-links-module-ModerationModule-8a6778b635f6f4648523a6380d08f9e8900d446586cddbe368e2d07e7084681d806b6f744d69450980d139f7473065003fd62f6a9304ab570b82956a37a4d347"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ModerationModule-8a6778b635f6f4648523a6380d08f9e8900d446586cddbe368e2d07e7084681d806b6f744d69450980d139f7473065003fd62f6a9304ab570b82956a37a4d347"' :
                                        'id="xs-injectables-links-module-ModerationModule-8a6778b635f6f4648523a6380d08f9e8900d446586cddbe368e2d07e7084681d806b6f744d69450980d139f7473065003fd62f6a9304ab570b82956a37a4d347"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TasksModule.html" data-type="entity-link" >TasksModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TasksModule-3316de5c0ea70cf8d629f5422a5142ffda7449f64012f22b1b7e91bc5ec8e88ee92cc9d90135eed6ecf084a0b0aa99e1741a814e8e3003df1bbabaa12c1c2d0e"' : 'data-bs-target="#xs-injectables-links-module-TasksModule-3316de5c0ea70cf8d629f5422a5142ffda7449f64012f22b1b7e91bc5ec8e88ee92cc9d90135eed6ecf084a0b0aa99e1741a814e8e3003df1bbabaa12c1c2d0e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TasksModule-3316de5c0ea70cf8d629f5422a5142ffda7449f64012f22b1b7e91bc5ec8e88ee92cc9d90135eed6ecf084a0b0aa99e1741a814e8e3003df1bbabaa12c1c2d0e"' :
                                        'id="xs-injectables-links-module-TasksModule-3316de5c0ea70cf8d629f5422a5142ffda7449f64012f22b1b7e91bc5ec8e88ee92cc9d90135eed6ecf084a0b0aa99e1741a814e8e3003df1bbabaa12c1c2d0e"' }>
                                        <li class="link">
                                            <a href="injectables/GuildRestrictedChannelService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildRestrictedChannelService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildSettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildSettingsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GuildUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuildUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TasksService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-1d798fad1538dd74e58dc8e88a2145eca238e9a8923fc50cafd907ad3fcec9f18bcebbd6dd38f6dfd7024c2a7c1df2ee87f22ad96b03e33b08b5660417ee3b97"' : 'data-bs-target="#xs-controllers-links-module-UserModule-1d798fad1538dd74e58dc8e88a2145eca238e9a8923fc50cafd907ad3fcec9f18bcebbd6dd38f6dfd7024c2a7c1df2ee87f22ad96b03e33b08b5660417ee3b97"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-1d798fad1538dd74e58dc8e88a2145eca238e9a8923fc50cafd907ad3fcec9f18bcebbd6dd38f6dfd7024c2a7c1df2ee87f22ad96b03e33b08b5660417ee3b97"' :
                                            'id="xs-controllers-links-module-UserModule-1d798fad1538dd74e58dc8e88a2145eca238e9a8923fc50cafd907ad3fcec9f18bcebbd6dd38f6dfd7024c2a7c1df2ee87f22ad96b03e33b08b5660417ee3b97"' }>
                                            <li class="link">
                                                <a href="controllers/SelfController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelfController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-1d798fad1538dd74e58dc8e88a2145eca238e9a8923fc50cafd907ad3fcec9f18bcebbd6dd38f6dfd7024c2a7c1df2ee87f22ad96b03e33b08b5660417ee3b97"' : 'data-bs-target="#xs-injectables-links-module-UserModule-1d798fad1538dd74e58dc8e88a2145eca238e9a8923fc50cafd907ad3fcec9f18bcebbd6dd38f6dfd7024c2a7c1df2ee87f22ad96b03e33b08b5660417ee3b97"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-1d798fad1538dd74e58dc8e88a2145eca238e9a8923fc50cafd907ad3fcec9f18bcebbd6dd38f6dfd7024c2a7c1df2ee87f22ad96b03e33b08b5660417ee3b97"' :
                                        'id="xs-injectables-links-module-UserModule-1d798fad1538dd74e58dc8e88a2145eca238e9a8923fc50cafd907ad3fcec9f18bcebbd6dd38f6dfd7024c2a7c1df2ee87f22ad96b03e33b08b5660417ee3b97"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SelfService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelfService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddRoleCommand.html" data-type="entity-link" >AddRoleCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuditLogFilterDto.html" data-type="entity-link" >AuditLogFilterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Channel.html" data-type="entity-link" >Channel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChannelCleaned.html" data-type="entity-link" >ChannelCleaned</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChannelNotTextBasedException.html" data-type="entity-link" >ChannelNotTextBasedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChannelNotTextBasedExceptionFilter.html" data-type="entity-link" >ChannelNotTextBasedExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CleanWfpMember.html" data-type="entity-link" >CleanWfpMember</a>
                            </li>
                            <li class="link">
                                <a href="classes/CoffeeCommand.html" data-type="entity-link" >CoffeeCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommandValidationFilter.html" data-type="entity-link" >CommandValidationFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommunityQuestionCommand.html" data-type="entity-link" >CommunityQuestionCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommunityQuestionDto.html" data-type="entity-link" >CommunityQuestionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommunityQuestionFormDto.html" data-type="entity-link" >CommunityQuestionFormDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DiscordGuildMember.html" data-type="entity-link" >DiscordGuildMember</a>
                            </li>
                            <li class="link">
                                <a href="classes/DiscordUser.html" data-type="entity-link" >DiscordUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditRoleData.html" data-type="entity-link" >EditRoleData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Explorer.html" data-type="entity-link" >Explorer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Guild.html" data-type="entity-link" >Guild</a>
                            </li>
                            <li class="link">
                                <a href="classes/GuildAutoDeleteChannelDto.html" data-type="entity-link" >GuildAutoDeleteChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GuildChannelEditOptions.html" data-type="entity-link" >GuildChannelEditOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/GuildDoesNotExistException.html" data-type="entity-link" >GuildDoesNotExistException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GuildDoesNotExistExceptionFilter.html" data-type="entity-link" >GuildDoesNotExistExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/initGuildCommand.html" data-type="entity-link" >initGuildCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogEntry.html" data-type="entity-link" >LogEntry</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogEntryDto.html" data-type="entity-link" >LogEntryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModAnouncementDto.html" data-type="entity-link" >ModAnouncementDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MumVoiceCommand.html" data-type="entity-link" >MumVoiceCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermissionOverwrite.html" data-type="entity-link" >PermissionOverwrite</a>
                            </li>
                            <li class="link">
                                <a href="classes/PingCommand.html" data-type="entity-link" >PingCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestrictedChannelDto.html" data-type="entity-link" >RestrictedChannelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleResponse.html" data-type="entity-link" >RoleResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelfDto.html" data-type="entity-link" >SelfDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelfDto-1.html" data-type="entity-link" >SelfDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendDirectMessageToUserException.html" data-type="entity-link" >SendDirectMessageToUserException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendDirectMessageToUserExceptionFilter.html" data-type="entity-link" >SendDirectMessageToUserExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetFirstMessageUICommand.html" data-type="entity-link" >SetFirstMessageUICommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsChanged.html" data-type="entity-link" >SettingsChanged</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsDto.html" data-type="entity-link" >SettingsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SlowmodeDisabled.html" data-type="entity-link" >SlowmodeDisabled</a>
                            </li>
                            <li class="link">
                                <a href="classes/SlowmodeEnabled.html" data-type="entity-link" >SlowmodeEnabled</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeOutCommand.html" data-type="entity-link" >TimeOutCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnverifyByRoleCommand.html" data-type="entity-link" >UnverifyByRoleCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserBanEvent.html" data-type="entity-link" >UserBanEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserInfoUiCommand.html" data-type="entity-link" >UserInfoUiCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserKickEvent.html" data-type="entity-link" >UserKickEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserPurgeEvent.html" data-type="entity-link" >UserPurgeEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSendDMFailedEvent.html" data-type="entity-link" >UserSendDMFailedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserTimeOutDto.html" data-type="entity-link" >UserTimeOutDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserTimeOutEvent.html" data-type="entity-link" >UserTimeOutEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserTimeOutFailedEvent.html" data-type="entity-link" >UserTimeOutFailedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserToUser.html" data-type="entity-link" >UserToUser</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuditEvents.html" data-type="entity-link" >AuditEvents</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DmMessageHandler.html" data-type="entity-link" >DmMessageHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GuildMemberEvents.html" data-type="entity-link" >GuildMemberEvents</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GuildMessageHandler.html" data-type="entity-link" >GuildMessageHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModRequestFlow.html" data-type="entity-link" >ModRequestFlow</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshJwtGuard.html" data-type="entity-link" >RefreshJwtGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/HasRequiredRank.html" data-type="entity-link" >HasRequiredRank</a>
                            </li>
                            <li class="link">
                                <a href="guards/IsModalInteractionGuard.html" data-type="entity-link" >IsModalInteractionGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/IsUserUnlockedGuard.html" data-type="entity-link" >IsUserUnlockedGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/MessageFromUserGuard.html" data-type="entity-link" >MessageFromUserGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/MessageIsDmGuard.html" data-type="entity-link" >MessageIsDmGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ReactedMemberIsModOrHigherGuard.html" data-type="entity-link" >ReactedMemberIsModOrHigherGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BotEvent.html" data-type="entity-link" >BotEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DiscordExecutionContext.html" data-type="entity-link" >DiscordExecutionContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventToLog.html" data-type="entity-link" >EventToLog</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});