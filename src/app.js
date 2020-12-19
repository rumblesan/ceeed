/* global CodeMirror */

import './index.html';
import './favicon.ico';
import './styles/main.scss';
import './code/editor/ceed-mode';

import './code/polyfills';

import * as templates from './templates';

import { clickHandler } from './code/dom';
import { getConfig } from './code/config';
import { encodeProgram } from './code/encoder';

import { EventBus } from './code/event-bus';
import { Ceed } from './code/ceed';
import { Popups } from './code/ui/popups';
import { UI } from './code/ui';

const config = getConfig();
const eventBus = new EventBus();
const ui = new UI(eventBus);
const popups = new Popups(document.querySelector('body'));
eventBus.on('display-popup', popups.trigger.bind(popups));
popups.register('error-popup', false, (message, error) => {
  return templates.errorPopup({
    message,
    error,
  });
});

const ceed = new Ceed(config, eventBus, CodeMirror);

popups.register('sharing', true, () => {
  const encodedProgram = encodeProgram(ceed.getProgram());
  const programSharingURL = URL.fromLocation();
  programSharingURL.searchParams.set('program', encodedProgram);
  // TODO maybe make the entire URL clear of params???
  programSharingURL.hash = '';
  return templates.sharingPopup({
    programSharingURL: programSharingURL.toString(),
  });
});
popups.register('settings', true, () => {
  const defaultKeymapURL = URL.fromLocation();
  defaultKeymapURL.searchParams.delete('keymap');
  const vimKeymapURL = URL.fromLocation();
  vimKeymapURL.searchParams.set('keymap', 'vim');

  const performanceDisabledURL = URL.fromLocation();
  performanceDisabledURL.searchParams.delete('performancemode');
  const performanceEnabledURL = URL.fromLocation();
  performanceEnabledURL.searchParams.set('performancemode', 'enabled');

  const lineNumbersDisabledURL = URL.fromLocation();
  lineNumbersDisabledURL.searchParams.delete('linenumbers');
  const lineNumbersEnabledURL = URL.fromLocation();
  lineNumbersEnabledURL.searchParams.set('linenumbers', 'enabled');

  return templates.settingsPopup({
    defaultKeymapURL: defaultKeymapURL.toString(),
    vimKeymapURL: vimKeymapURL.toString(),
    performanceEnabledURL: performanceEnabledURL.toString(),
    performanceDisabledURL: performanceDisabledURL.toString(),
    lineNumbersEnabledURL: lineNumbersEnabledURL.toString(),
    lineNumbersDisabledURL: lineNumbersDisabledURL.toString(),
  });
});

clickHandler('#evaluate', () => eventBus.emit('evaluate'));
clickHandler('#display-glsl', () => eventBus.emit('display-popup', 'glslcode'));
clickHandler('#display-sharing', () =>
  eventBus.emit('display-popup', 'sharing')
);
clickHandler('#display-settings', () =>
  eventBus.emit('display-popup', 'settings')
);

if (config.performanceMode) {
  ui.performanceMode();
}

const hash = URL.getHash();
if (hash) {
  eventBus.emit('display-popup', hash);
}
