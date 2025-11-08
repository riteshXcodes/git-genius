import IssueList from "./issues-list";
type Props = {
    params: Promise<{ meetingId: string }>
}
const MeetingDetails = async ({ params }: Props) => {
    const { meetingId } = await params;
    return (
        <>
            <IssueList meetingId={meetingId} />
        </>
    )
}
export default MeetingDetails;