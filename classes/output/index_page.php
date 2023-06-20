<?php

namespace report_autograder\output;

use renderable;
use renderer_base;
use templatable;
use stdClass;

class index_page implements renderable, templatable
{
    /**
     * @var string $data_to_render
     */
    private $data_to_render = null;

    private $additional_data;

    public function __construct($data_to_render,$additional_data)
    {
        $this->data_to_render = $data_to_render;
        $this->additional_data = $additional_data;
    }

    /**
     * Export this data so it can be used as the context for a mustache template.
     *
     * @return stdClass
     */
    public function export_for_template(renderer_base $output): stdClass {
        $data = new stdClass();
        $data->data_to_render = $this->data_to_render;
        $data->additional_data = $this->additional_data;
        return $data;
    }
}