import { useQuery, gql } from '@apollo/client';

export default async function getUserCharacters(res, req) {
    const query = gql`
        query {
            getUserCharacters {
                _id
                flavor {
                    traits {
                        name
                    }
                    portrait
                }
            }
        }
    `

    const { data, loading, error } = useQuery(query);

    if (!loading) {
        res.status(200).json({ data })
    } else {
        res.status(400).json({ error })
    }
}