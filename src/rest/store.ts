import { configureStore, createSlice } from '@reduxjs/toolkit'
import Resources from "../resources"

const initialResources: Record<string, { byId: fhir4.Resource[], allIds: string[]}> = {}
Object.keys(Resources).forEach((resource) => {
  initialResources[resource] = {
    byId: [],
    allIds: []
  }
})

const resourcesSlice = createSlice({
  name: 'resources',
  initialState: initialResources,
  reducers: {
    created(state, action) {
      
      state[action.payload.resourceType].byId.push(action.payload)
      state[action.payload.resourceType].allIds.push(action.payload.id)
    }
  }
})

export const { created } = resourcesSlice.actions

export default configureStore({
  reducer: {
    resources: resourcesSlice.reducer
  }
})