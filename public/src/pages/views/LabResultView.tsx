import * as React from "react";
import { LabResult, LastBuild, LastBuildInfo, Row } from "../../components";
import { ISubmissionLink, ISubmission } from "../../models";
import { User, Submission } from "../../../proto/ag_pb";
import { Release } from "../../components/manual-grading/Release";
interface ILabInfoProps {
    submissionLink: ISubmissionLink;
    student: User;
    courseURL: string;
    slipdays: number;
    teacherPageView: boolean;
    onApproveClick: (status: Submission.Status, approve: boolean) => Promise<boolean>;
    onRebuildClick: (assignmentID: number, submissionID: number) => Promise<boolean>;
}

export class LabResultView extends React.Component<ILabInfoProps> {

    public render() {
        if (this.props.submissionLink.submission) {
            const latest = this.props.submissionLink.submission;
            const buildLog = latest.buildLog.split("\n").map((x, i) => <span key={i} >{x}<br /></span>);
            return (
                <div key="labhead" className="col-md-9 col-sm-9 col-xs-12">
                    <div key="labview" className="result-content" id="resultview">
                        <section id="result">
                            <LabResult
                                assignment_id={this.props.submissionLink.assignment.getId()}
                                submission_id={latest.id}
                                teacherView={this.props.teacherPageView}
                                lab={this.props.submissionLink.assignment.getName()}
                                progress={latest.score}
                                status={latest.status}
                                isApproved={latest.status === Submission.Status.APPROVED}
                                authorName={this.props.submissionLink.authorName}
                                onApproveClick={this.props.onApproveClick}
                                onRebuildClick={this.props.onRebuildClick}
                            />
                            <LastBuildInfo
                                submission={latest}
                                slipdays={this.props.slipdays}
                                assignment={this.props.submissionLink.assignment}
                            />
                            <LastBuild
                                test_cases={latest.testCases}
                                score={latest.score}
                                scoreLimit={this.props.submissionLink.assignment.getScorelimit()}
                                weight={100}
                            />
                            {this.props.submissionLink.assignment.getReviewers() > 0 && latest.released ? this.renderReviewInfo(latest) : null}
                            <Row><div key="loghead" className="col-lg-12"><div key="logview" className="well"><code id="logs">{buildLog}</code></div></div></Row>
                        </section>
                    </div>
                </div>
            );
        }
        return <h1>No submissions yet</h1>;
    }


    private reviewersForStudentPage(submission: ISubmission): User[] {
        const reviewers: User[] = [];
        submission.reviews.forEach(r => {
            if (r.getReady()) {
                const reviewer = new User();
                reviewer.setId(r.getReviewerid());
                reviewers.push(reviewer);
            }
        });
        return reviewers;
    }

    private renderReviewInfo(submission: ISubmission): JSX.Element {
        if (this.props.teacherPageView) {
            return <div className="row">
            </div>
        }
        return <Release
            submission={submission}
            assignment={this.props.submissionLink.assignment}
            authorName={this.props.student.getName()}
            authorLogin={this.props.student.getLogin()}
            studentNumber={0}
            courseURL={this.props.courseURL}
            teacherView={false}
            isSelected={true}
            setGrade={async () => { return false }}
            release={() => { return }}
            getReviewers={async () => {return this.reviewersForStudentPage(submission)}}
        />
    }
}
