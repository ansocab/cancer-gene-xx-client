import React, { useState } from 'react'
import { Button, Collapse } from 'react-bootstrap'
import 'bootswatch/dist/flatly/bootstrap.min.css'

export default function CollapsableCard(props) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<div className='card border-primary mb-2 mt-3' style={{ width: '70rem' }}>
				<div className='card-header'>
					<h5>
						<Button
							onClick={() => setOpen(!open)}
							aria-controls='example-collapse-text'
							aria-expanded={open}
						>
							{props.title}
						</Button>
					</h5>
				</div>
				<Collapse in={open}>
					<div className='card-body'>
						<h4 className='card-title'>Primary card title</h4>
						{props.children}
					</div>
				</Collapse>
			</div>
		</>
	)
}
