import { json, redirect } from "@remix-run/node"
import invariant from "tiny-invariant"
import {
  getLocalAuthenticatedUser,
  isAuthorizedUser,
} from "~/utils/user.server"
import { getTaxonomyById } from "~/models/taxonomy.server"
import type { LoaderFunction } from "@remix-run/node"
import type { Bird, Taxonomy } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"

import { Link } from "react-router-dom"
import { DisplayBird } from "~/components/DisplayBird"

interface LoaderData extends Partial<Taxonomy> {
  isAuthorized: boolean
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id
  invariant(id, "No Invalid id")
  const data = await getTaxonomyById(id)

  //authorization
  const authorizedUser = await getLocalAuthenticatedUser(request)
  if (!authorizedUser) return redirect("/users/login")
  const isAuthorized = isAuthorizedUser(authorizedUser?.role)
  if (data) {
    const bird = data as unknown as Taxonomy
    return json<LoaderData>({ ...bird, isAuthorized })
  }
  return null
}

export default function BirdById() {
  const data = useLoaderData<LoaderData>()
  const { isAuthorized, ...bird } = data
  return (
    <article className="layout">
      <DisplayBird
        englishName={bird.englishName}
        id={bird.id}
        rank={bird.rank}
        taxonomy={bird.taxonomy}
        isAuthorized={isAuthorized}
      />
    </article>
  )
}
