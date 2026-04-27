import {
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  SELECT_TOOL_3D_VIEW,
  SELECT_TOOL_3D_FIRST_PERSON
} from '../constants';
import { Project } from '../class/export';
import { history } from '../utils/export';
import { Map, List } from 'immutable';

function cancelPendingDrawing(state) {
  // Clear all in-progress drawing state without reverting the scene.
  // This preserves all committed holes/items while discarding unsaved drawing support.
  state = Project.unselectAll(state).updatedState;
  state = state.merge({
    snapElements: new List(),
    activeSnapElement: null,
    drawingSupport: new Map(),
    draggingSupport: new Map(),
    rotatingSupport: new Map(),
  });
  return state;
}

export default function (state, action) {

  switch (action.type) {
    case SELECT_TOOL_3D_VIEW:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      state = cancelPendingDrawing(state);
      state = Project.setMode( state, MODE_3D_VIEW ).updatedState;
      return state;

    case SELECT_TOOL_3D_FIRST_PERSON:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      state = cancelPendingDrawing(state);
      state = Project.setMode( state, MODE_3D_FIRST_PERSON ).updatedState;
      return state;

    default:
      return state;
  }
}
