import React, { useState, useEffect } from 'react'

import type { Mfer, Profile } from '../../interfaces'
import { read as readProfile } from '../../services/profiles'
import { useWeb3, useMfers } from '../../hooks'
import { isValidMferId } from '../../utils'

import { Container } from '../../components/Shared'
import Layout from '../../components/Layout'
import ProfileCard from '../../components/ProfileCard'
import AttributesCard from '../../components/AttributesCard'
import BioSection from '../../components/BioSection'
import EditProfileModal from '../../components/EditProfileModal'

interface ProfilePageProps {
  mferId: number
  profile?: Profile
  error?: any
}

export default function ProfilePage({
  mferId,
  profile,
  error,
}: ProfilePageProps) {
  const { address } = useWeb3()
  const { getMfer, checkMferOwnership } = useMfers()
  const [mfer, setMfer] = useState<Mfer>()
  const [isMferOwner, setIsMferOwner] = useState<boolean>()
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>()

  // TODO: used for debugging, remove if not required
  useEffect(() => {
    console.log({ profile })
  }, [])

  // Fetch mfer data on page load
  useEffect(() => {
    if (mferId !== undefined) {
      getMfer(mferId).then(async result => setMfer(result))
    }
  }, [mferId])

  // Check if connected wallet owns mfer
  useEffect(() => {
    if (address && mferId !== undefined) {
      checkMferOwnership(mferId, address).then(result => {
        setIsMferOwner(result)
      })
    }
  }, [address, mferId])

  const onEditProfileClick = () => {
    setEditModalIsOpen(true)
  }

  const onEditModalClose = () => {
    setEditModalIsOpen(false)
  }

  if (error || isNaN(mferId))
    return <h1>server error - check backend console</h1>
  if (!mfer) return <div>fetching mfer...</div>

  return (
    <Layout title={`${mfer.name} | mferspace`}>
      <Container style={{ marginTop: '1rem' }}>
        {isMferOwner && (
          <button
            onClick={onEditProfileClick}
            disabled={editModalIsOpen}
            style={{ marginBottom: '0.5rem' }}>
            edit profile
          </button>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
          <div style={{ marginRight: '4rem' }}>
            <ProfileCard mfer={mfer} profile={profile} />
            <AttributesCard attributes={mfer.attributes} />
          </div>
          <BioSection
            name={mfer.name}
            bioAbout={profile?.bio_about}
            bioMeet={profile?.bio_meet}
          />

          {editModalIsOpen && (
            <EditProfileModal
              mferId={mferId}
              profile={profile}
              onClose={onEditModalClose}
            />
          )}
        </div>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async ({ query: { id } }: any) => {
  try {
    // redirect home if invalid id route param sent
    if (!isValidMferId(id)) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      }
    }

    // fetch, serialize & return profile data
    const profile = await readProfile(id)
    return { props: { mferId: id, profile, error: false } }
  } catch (error) {
    console.log(error)
    return { props: { error: true } }
  }
}