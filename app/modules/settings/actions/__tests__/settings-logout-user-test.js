import { expect } from "chai"
import * as sinon from "sinon"

import {settingsLogoutUser} from "../settings-logout-user"
import {settingsUpdateUserState} from "../settings-update-user-state"
import {assignmentReset} from "../../../assignment/actions/assignment-reset"
import {submissionReset} from "../../../submissions/actions/submission-reset"
import {paginationReset} from "../../../pagination/actions/pagination-reset"

const keytar = require("keytar")
const {session} = require("electron").remote

describe("settingsLogoutUser", () => {
  let dispatch

  beforeEach(() => {
    dispatch = sinon.stub()
    dispatch.resolves("")
  })

  afterEach(() => {
    dispatch = null
  })

  context(("It clears application state"), () => {
    it("resets assignment", async () => {
      await settingsLogoutUser()(dispatch)

      expect(dispatch.calledWithMatch(assignmentReset)).is.true
    })

    it("resets submissions", async () => {
      await settingsLogoutUser()(dispatch)

      expect(dispatch.calledWithMatch(submissionReset)).is.true
    })

    it("resets pagination", async () => {
      await settingsLogoutUser()(dispatch)

      expect(dispatch.calledWithMatch(paginationReset)).is.true
    })
  })

  it("dispatches update user state", async () => {
    await settingsLogoutUser()(dispatch)

    expect(dispatch.calledWithMatch(settingsUpdateUserState)).is.true
  })

  it("clears session storage", async () => {
    const sessionSpy = sinon.spy()
    session.defaultSession.clearStorageData = sessionSpy
    await settingsLogoutUser()(dispatch)

    expect(sessionSpy.calledOnce).is.true
  })

  // TODO: Make this test more specific after keytar config is finalized
  it("calls node keytar delete password", async () => {
    const keytarStub = sinon.stub(keytar, "deletePassword")
    await settingsLogoutUser()(dispatch)

    expect(keytarStub.calledOnce).is.true
  })
})
