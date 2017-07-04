package scm

import (
	"context"

	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
)

// GithubSCM implements the SCM interface.
type GithubSCM struct {
	client *github.Client
}

// NewGithubSCMClient returns a new Github client implementing the SCM interface.
func NewGithubSCMClient(token string) *GithubSCM {
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	client := github.NewClient(oauth2.NewClient(context.Background(), ts))
	return &GithubSCM{
		client: client,
	}
}

// ListDirectories implements the SCM interface.
func (s *GithubSCM) ListDirectories(ctx context.Context) ([]*Directory, error) {
	orgs, _, err := s.client.Organizations.ListOrgMemberships(ctx, nil)
	if err != nil {
		return nil, err
	}

	var directories []*Directory
	for _, org := range orgs {
		directories = append(directories, &Directory{
			ID:   org.Organization.GetID(),
			Name: org.Organization.GetLogin(),
		})
	}
	return directories, nil
}

// CreateDirectory implements the SCM interface.
func (s *GithubSCM) CreateDirectory(ctx context.Context, opt *CreateDirectoryOptions) (*Directory, error) {
	panic("CreateDirectory is not provided by github")
}

// GetDirectory implements the SCM interface.
func (s *GithubSCM) GetDirectory(ctx context.Context, id int) (*Directory, error) {
	org, _, err := s.client.Organizations.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &Directory{
		Name: org.GetName(),
	}, nil
}