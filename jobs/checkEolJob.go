package jobs

import "jewels/eol"

type CheckEol struct{}

func (CheckEol) Run() {
	eol.CheckEol()
}
