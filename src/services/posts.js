import { CreateDraft, PublishPost, UpdatePost } from '@gql/user'
import { apolloClient } from '@state/index'
import { getCurrentUser } from '@services/auth'

const makeDraft = async (title, text) => {
  const user = await getCurrentUser()
  if (user) {
    const result = await apolloClient
      .mutate({
        mutation: CreateDraft,
        variables: { title: title, text: text },
      })
      .catch(err => {
        return err
      })
    return result
  } else {
    return "Can't save the draft: Not logged in!"
  }
}

const publishDraft = async draftId => {
  const user = getCurrentUser()
  if (user) {
    const result = await apolloClient
      .mutate({
        mutation: PublishPost,
        variables: { id: draftId },
      })
      .catch(err => {
        return err
      })
    return result
  } else {
    return "Can't publish the draft: Not logged in!"
  }
}

const updateContent = async (postId, newTitle, newText) => {
  const user = getCurrentUser()
  if (user) {
    const result = await apolloClient
      .mutate({
        mutation: UpdatePost,
        variables: { id: postId, title: newTitle, text: newText },
      })
      .catch(err => {
        return err
      })
    return result
  } else {
    return "Can't update this post: Not logged in!"
  }
}

export { makeDraft, publishDraft, updateContent }
