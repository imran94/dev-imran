import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        isSeparateMailingAddress: false,

        addressFields: {
            residentStructureAddressZone: '',
            residentStructureAddressDistrict: '',
            residentStructureAddressSubdistrict: '',
            residentStructureAddressStreet: '',
            residentStructureAddressVillage: '',
            residentStructureAddressEstate: '',
            residentStructureAddressBlock: '',
            residentStructureAddressFloor: '',
            residentStructureAddressFlat: '',
            mailingStructureAddressZone: '',
            mailingStructureAddressDistrict: '',
            mailingStructureAddressSubdistrict: '',
            mailingStructureAddressStreet: '',
            mailingStructureAddressVillage: '',
            mailingStructureAddressEstate: '',
            mailingStructureAddressBlock: '',
            mailingStructureAddressFloor: '',
            mailingStructureAddressFlat: '',
        },
    },
    getters: {
        // ...
        getAddressFieldByTypeAndKey: (state) => ({ addressType, key }) => {
            return state.addressFields[`${addressType}StructureAddress${key}`]
        }
    },
    mutations: {
        updateIsSeparateMailingAddress(state, value) {
            state.isSeparateMailingAddress = value
            if (!value) {
                state.addressFields.mailingStructureAddressZone = state.addressFields.residentStructureAddressZone
                state.addressFields.mailingStructureAddressDistrict = state.addressFields.residentStructureAddressDistrict
                state.addressFields.mailingStructureAddressSubdistrict = state.addressFields.residentStructureAddressSubdistrict
                state.addressFields.mailingStructureAddressStreet = state.addressFields.residentStructureAddressStreet
                state.addressFields.mailingStructureAddressVillage = state.addressFields.residentStructureAddressVillage
                state.addressFields.mailingStructureAddressEstate = state.addressFields.residentStructureAddressEstate
                state.addressFields.mailingStructureAddressBlock = state.addressFields.residentStructureAddressBlock
                state.addressFields.mailingStructureAddressFloor = state.addressFields.residentStructureAddressFloor
                state.addressFields.mailingStructureAddressFlat = state.addressFields.residentStructureAddressFlat
            } else {
                state.addressFields.mailingStructureAddressZone = ''
                state.addressFields.mailingStructureAddressDistrict = ''
                state.addressFields.mailingStructureAddressSubdistrict = ''
                state.addressFields.mailingStructureAddressStreet = ''
                state.addressFields.mailingStructureAddressVillage = ''
                state.addressFields.mailingStructureAddressEstate = ''
                state.addressFields.mailingStructureAddressBlock = ''
                state.addressFields.mailingStructureAddressFloor = ''
                state.addressFields.mailingStructureAddressFlat = ''
            }
        },
        updateAddressFieldByTypeAndKeyValue(state, {
            addressType,
            key,
            value
        }) {
            value = value?.toUpperCase()

            state.addressFields[`${addressType}StructureAddress${key}`] = value

            if (addressType !== 'mailing' &&
                !state.isSeparateMailingAddress) {
                state.addressFields[`mailingStructureAddress${key}`] = value
            }
        },
        setAddressFieldsFromPatientData(state, patientForm) {
            state.isSeparateMailingAddress = patientForm.isSeparateMailingAddress
            for (const [key, value] of Object.entries(patientForm)) {
                if (key in state.addressFields) {
                    state.addressFields[key] = value
                }
            }
        }
    }
})
